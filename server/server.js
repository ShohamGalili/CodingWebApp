const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/UserModel');  // Import User model
const CodeBlock = require('./models/CodeBlockModel');  // Import CodeBlock model
const http = require('http');
const { Server } = require('socket.io');
const { ObjectId } = require('mongodb');
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

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// ################################################ DB & HTTP ########################################################
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Add user to MongoDB (create if it doesn't exist)
const addUserToDB = async (socketId, codeBlockId, role) => {
    try {
        let user = await User.findOne({ socketId });
        // If user doesn't exist, create a new one
        if (!user) {
            user = new User({
                socketId,
                currentCodeBlockId: codeBlockId,
                solvedCodeBlocks: []
            });
            await user.save();
        } else {
            // If user exists, update their current code block
            user.currentCodeBlockId = codeBlockId;
            await user.save();
        }

        console.log(`User ${user._id} added or updated in the database`);
    } catch (error) {
        console.error('Error adding user to database:', error);
    }
};


// Create a new user and add them to a code block (API route)
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

// Add a new code block to the database
app.post('/api/codeblocks', async (req, res) => {
    try {
        const { title, initialTemplate, solution } = req.body;

        const newCodeBlock = new CodeBlock({
            title,
            initialTemplate,
            solution,
            currentContent: initialTemplate,
            usersOfCodeBlock: []
        });

        await newCodeBlock.save();

        res.status(201).json(newCodeBlock);  // The _id will be generated automatically
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Update the code block content in real-time
app.put('/api/codeblocks/:id', async (req, res) => {
    try {
        const codeBlockId = req.params.id;
        const { currentContent } = req.body;

        const codeBlock = await CodeBlock.findByIdAndUpdate(
            codeBlockId,
            { currentContent },
            { new: true }
        );

        if (!codeBlock) {
            return res.status(404).json({ error: 'Code block not found' });
        }

        res.status(200).json(codeBlock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add user to code block with a role
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
            codeBlock.isMentorPresent = true;  // Set mentor presence
        }

        await codeBlock.save();

        res.status(200).json(codeBlock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all code blocks
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


// Store users in each code block (code block ID => list of users)
const codeBlockUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining a code block
    socket.on('joinCodeBlock', async (blockId) => {
        console.log(`User ${socket.id} is trying to join code block ${blockId}`);

        if (!codeBlockUsers[blockId]) {
            codeBlockUsers[blockId] = [];
        }

        // Log current users in the code block
        console.log(`Current users in code block ${blockId}:`, codeBlockUsers[blockId]);

        // Assign role: first user = mentor, subsequent users = students
        let role = 'student';  // Default to student
        if (codeBlockUsers[blockId].length === 0) {
            role = 'mentor';  // First user becomes mentor
            console.log(`User ${socket.id} is the first in the block and is assigned as mentor`);
        } else {
            console.log(`User ${socket.id} is assigned as a student`);
        }

        codeBlockUsers[blockId].push({ socketId: socket.id, role });

        // Add the user to the MongoDB Users collection
        await addUserToDB(socket.id, blockId, role);

        // Join the code block room
        socket.join(blockId);

        // Send the role to the user
        socket.emit('role', role);

        // Emit only the student count (excluding the mentor)
        const studentCount = codeBlockUsers[blockId].filter(user => user.role === 'student').length;
        io.to(blockId).emit('studentCount', studentCount);

        // Handle real-time code updates
        socket.on('codeUpdate', (newCode) => {
            io.to(blockId).emit('codeUpdate', newCode);  // Broadcast the updated code to all users in the block
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected from block ${blockId}`);

            // Remove user from the code block
            codeBlockUsers[blockId] = codeBlockUsers[blockId].filter(user => user.socketId !== socket.id);

            // If the mentor leaves, reset the code block and notify students
            if (role === 'mentor') {
                console.log(`Mentor ${socket.id} left the code block`);
                io.to(blockId).emit('mentorLeft');  // Notify all students the mentor has left
                codeBlockUsers[blockId] = [];  // Clear the code block for new users
            }

            // Update student count for everyone in the block
            io.to(blockId).emit('studentCount', codeBlockUsers[blockId].length);
        });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
