const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/UserModel');
const CodeBlock = require('./models/CodeBlockModel');
const http = require('http');
const { Server } = require('socket.io');
const initialCodeBlocks = require('./initialCodeBlocks');

dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Log incoming requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// ################################################ DB & HTTP ########################################################

// Seeding function to reset and populate initial code blocks
const seedInitialCodeBlocks = async () => {
    try {
        await CodeBlock.deleteMany({});

        await CodeBlock.insertMany(initialCodeBlocks);
    } catch (error) {
        console.error('Error resetting and seeding code blocks:', error);
    }
};

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        seedInitialCodeBlocks();  // Seed the initial code blocks
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Add user to MongoDB or update if already exists
const addUserToDB = async (socketId, codeBlockId, role) => {
    try {
        let user = await User.findOne({ socketId });
        if (!user) {
            user = new User({
                socketId,
                currentCodeBlockId: codeBlockId,
                solvedCodeBlocks: []
            });
            await user.save();
        } else {
            user.currentCodeBlockId = codeBlockId;
            await user.save();
        }

    } catch (error) {
        console.error('Error adding user to database:', error);
    }
};

// Add a code block to MongoDB or retrieve if already exists
const addCodeBlockToDB = async (socketId, title, initialTemplate, solution) => {
    try {
        let codeBlock = await CodeBlock.findOne({ socketId });

        if (!codeBlock) {
            codeBlock = new CodeBlock({
                blockId,
                title,
                initialTemplate,
                solution,
                currentContent: initialTemplate,
                usersOfCodeBlock: [],
                isMentorPresent: false
            });
            await codeBlock.save();
        } else {
            console.log(`Code block with socketId ${socketId} already exists`);
        }

        return codeBlock;
    } catch (error) {
        console.error('Error adding code block to database:', error);
        throw new Error(error);
    }
};

// API route to create a new user
app.post('/api/users', async (req, res) => {
    try {
        const { currentCodeBlockId } = req.body;
        const newUser = new User({
            currentCodeBlockId,
            solvedCodeBlocks: []
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API route to create a new code block
app.post('/api/codeblocks', async (req, res) => {
    try {
        const { title, initialTemplate, solution } = req.body;
        const newCodeBlock = new CodeBlock({
            blockId,
            title,
            initialTemplate,
            solution,
            currentContent: initialTemplate,
            usersOfCodeBlock: []
        });
        await newCodeBlock.save();
        res.status(201).json(newCodeBlock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API route to update code block content in real-time
app.put('/api/codeblocks/:id', async (req, res) => {
    try {
        const codeBlockId = req.params.id;
        const { currentContent } = req.body;
        const codeBlock = await CodeBlock.findByOneAndUpdate(
            { codeBlockId },
            { currentContent },
            { new: true }
        );
        if (!codeBlock) {
            return res.status(404).json({ error: 'Code block not found' });
        }
        res.status(201).json(codeBlock);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching code block' });
    }
});

// API route to add a user to a code block with a specific role
app.post('/api/codeblocks/:id/addUser', async (req, res) => {
    try {
        const codeBlockId = req.params.id;
        const { userId, role } = req.body;
        const codeBlock = await CodeBlock.findById(codeBlockId);
        if (!codeBlock) {
            return res.status(404).json({ error: 'Code block not found' });
        }
        codeBlock.usersOfCodeBlock.push({ userId, role });
        if (role === 'mentor') {
            codeBlock.isMentorPresent = true;
        }
        await codeBlock.save();
        res.status(200).json(codeBlock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API route to get all code blocks
app.get('/api/codeblocks', async (req, res) => {
    try {
        const codeBlocks = await CodeBlock.find();
        res.status(200).json(codeBlocks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// ################################################ DB & HTTP ########################################################

// In-memory storage for users in each code block
const codeBlockUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining a code block
    socket.on('joinCodeBlock', async (blockId) => {

        // Fetch the current content from MongoDB
        const codeBlock = await CodeBlock.findOne({ blockId });
        if (codeBlock) {
            socket.emit('codeUpdate', codeBlock.currentContent); // Send the current content to the newly joined client
        }

        // Initialize code block in memory if it doesn't exist
        if (!codeBlockUsers[blockId]) {
            codeBlockUsers[blockId] = [];
        }

        // Assign role: the first user is 'mentor', others are 'student'
        const role = codeBlockUsers[blockId].length === 0 ? 'mentor' : 'student';

        // Add the user to the in-memory object
        codeBlockUsers[blockId].push({ socketId: socket.id, role });

        // Update MongoDB CodeBlock document by adding the new user
        await CodeBlock.findOneAndUpdate(
            { blockId },
            { $push: { usersOfCodeBlock: { socketIdUser: socket.id, role } } },
            { new: true }
        );

        // Log current users in the code block
        console.log(`Current users in code block ${blockId}:`, codeBlockUsers[blockId]);

        // Add the user to MongoDB
        await addUserToDB(socket.id, blockId, role);

        // Join the user to the Socket.io room for the code block
        socket.join(blockId);

        // Send the assigned role to the user
        socket.emit('role', role);

        // Emit the student count (excluding the mentor) to all clients in the block
        const studentCount = codeBlockUsers[blockId].filter(user => user.role === 'student').length;
        io.to(blockId).emit('studentCount', studentCount);

        // Handle real-time code updates
        socket.on('codeUpdate', async (newCode) => {
            io.to(blockId).emit('codeUpdate', newCode); // Broadcast updated code to all users
            await CodeBlock.findOneAndUpdate(
                { blockId },
                { currentContent: newCode }
            );
        });

        // Handle user disconnection
        socket.on('disconnect', async () => {

            // Remove the user from the in-memory object
            codeBlockUsers[blockId] = codeBlockUsers[blockId].filter(user => user.socketId !== socket.id);

            // If the mentor leaves, notify students and reset the code block
            if (role === 'mentor') {
                io.to(blockId).emit('mentorLeft');  // Notify all students that the mentor has left
                codeBlockUsers[blockId] = [];  // Clear the code block for new users

                // Reset users and mentor presence in MongoDB
                await CodeBlock.findOneAndUpdate(
                    { blockId },
                    { isMentorPresent: false, usersOfCodeBlock: [], currentContent: initialCodeBlocks.find(block => block.blockId === blockId).initialTemplate }
                );
            } else {
                // Remove the user from MongoDB CodeBlock usersOfCodeBlock array
                await CodeBlock.findOneAndUpdate(
                    { blockId },
                    { $pull: { usersOfCodeBlock: { socketIdUser: socket.id } } }
                );
            }

            // Update student count for all users in the block
            const studentCount = codeBlockUsers[blockId].filter(user => user.role === 'student').length;
            io.to(blockId).emit('studentCount', studentCount);
        });

        // Handle mentor leaving the code block manually
        socket.on('mentorLeaveCodeBlock', async (blockId) => {
            io.to(blockId).emit('mentorLeft');  // Notify all students that the mentor has left
            codeBlockUsers[blockId] = [];  // Clear the code block

            // Reset mentor presence and users in MongoDB
            await CodeBlock.findOneAndUpdate(
                { blockId },
                { isMentorPresent: false, usersOfCodeBlock: [], currentContent: initialCodeBlocks.find(block => block.blockId === blockId).initialTemplate }
            );
        });
    });
});
