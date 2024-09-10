const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/UserModel');  // Import User model
const CodeBlock = require('./models/CodeBlockModel');  // Import CodeBlock model
const http = require('http');
const { Server } = require('socket.io');
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
const initialCodeBlocks = [
    {
        blockId: '1',  // מזהה מחרוזת פשוטה
        title: 'Async case',
        initialTemplate: '// async function example',
        solution: 'async function example() { /* solution here */ }',
        currentContent: '// async function example',
        isMentorPresent: false,
    },
    {
        blockId: '2',  // מזהה מחרוזת פשוטה
        title: 'Promise example',
        initialTemplate: '// promise example code here',
        solution: 'function promiseExample() { return new Promise((resolve, reject) => {/* solution here */}) }',
        currentContent: '// promise example code here',
        isMentorPresent: false,
    },
    {
        blockId: '3',  // מזהה מחרוזת פשוטה
        title: 'Closures',
        initialTemplate: '// closure example',
        solution: 'function closureExample() { /* solution here */ }',
        currentContent: '// closure example',
        isMentorPresent: false,
    },
    {
        blockId: '4',  // מזהה מחרוזת פשוטה
        title: 'Event Loop',
        initialTemplate: '// event loop example',
        solution: 'setTimeout(() => { /* solution here */ }, 0);',
        currentContent: '// event loop example',
        isMentorPresent: false,
    },
];


// Seeding function
/*const seedInitialCodeBlocks = async () => {
    try {
        const count = await CodeBlock.countDocuments();

        if (count === 0) {
            console.log('No code blocks found. Seeding initial data...');
            await CodeBlock.insertMany(initialCodeBlocks);
            console.log('Initial code blocks have been seeded.');
        } else {
            console.log('Code blocks already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding initial code blocks:', error);
    }
};*/

// Seeding function
const seedInitialCodeBlocks = async () => {
    try {
        console.log('Resetting the CodeBlocks collection...');

        // Delete all existing code blocks
        await CodeBlock.deleteMany({});
        console.log('All existing code blocks have been deleted.');

        // Insert the initial code blocks
        await CodeBlock.insertMany(initialCodeBlocks);
        console.log('Initial code blocks have been seeded.');
    } catch (error) {
        console.error('Error resetting and seeding code blocks:', error);
    }
};


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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


// Add user to MongoDB (create if it doesn't exist)
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

        console.log(`User ${user._id} added or updated in the database`);
    } catch (error) {
        console.error('Error adding user to database:', error);
    }
};

// Add a code block to MongoDB (create if it doesn't exist)
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
            console.log(`Code block with socketId ${socketId} created successfully`);
        } else {
            console.log(`Code block with socketId ${socketId} already exists`);
        }

        return codeBlock;
    } catch (error) {
        console.error('Error adding code block to database:', error);
        throw new Error(error);
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
            blockId,
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

        const codeBlock = await CodeBlock.findByOneAndUpdate(
            {codeBlockId},
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

app.get('/api/codeblocks', async (req, res) => {
    try {
        const codeBlocks = await CodeBlock.find();  // שליפת כל ה-CodeBlocks
        res.status(200).json(codeBlocks);  // החזרת כל ה-CodeBlocks במערך
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

        // Fetch the current content from MongoDB
        const codeBlock = await CodeBlock.findOne({ blockId });
        if (codeBlock) {
            socket.emit('codeUpdate', codeBlock.currentContent); // Send the current content to the newly joined client
        }

        // Initialize the code block in memory if it doesn't exist
        if (!codeBlockUsers[blockId]) {
            codeBlockUsers[blockId] = [];
        }

        // Assign role: the first user is 'mentor', others are 'student'
        const role = codeBlockUsers[blockId].length === 0 ? 'mentor' : 'student';

        // Add the user to the in-memory object (codeBlockUsers)
        codeBlockUsers[blockId].push({ socketId: socket.id, role });

        // Update MongoDB CodeBlock document by pushing the new user to usersOfCodeBlock
        await CodeBlock.findOneAndUpdate(
            { blockId },
            { $push: { usersOfCodeBlock: { socketIdUser: socket.id, role } } },  // הוספת המשתמש למערך usersOfCodeBlock
            { new: true }  // החזרת המסמך המעודכן
        );


        // Log current users in the code block
        console.log(`Current users in code block ${blockId}:`, codeBlockUsers[blockId]);

        // Add the user to the MongoDB Users collection
        await addUserToDB(socket.id, blockId, role);

        // Join the user to the Socket.io room for the code block
        socket.join(blockId);

        // Send the assigned role to the user (mentor or student)
        socket.emit('role', role);

        // Emit the student count (excluding the mentor) to all clients in the block
        const studentCount = codeBlockUsers[blockId].filter(user => user.role === 'student').length;
        io.to(blockId).emit('studentCount', studentCount);

        // Handle real-time code updates
        socket.on('codeUpdate', async (newCode) => {
            io.to(blockId).emit('codeUpdate', newCode); // Broadcast updated code to all users

            // Update currentContent in MongoDB
            await CodeBlock.findOneAndUpdate(
                { blockId },
                { currentContent: newCode }
            );
        });

        // Handle user disconnection
        socket.on('disconnect', async () => {
            console.log(`User ${socket.id} disconnected from block ${blockId}`);

            // Remove the user from the in-memory object (codeBlockUsers)
            codeBlockUsers[blockId] = codeBlockUsers[blockId].filter(user => user.socketId !== socket.id);

            // If the mentor leaves, notify students and reset the code block
            if (role === 'mentor') {
                console.log(`Mentor ${socket.id} left the code block`);
                io.to(blockId).emit('mentorLeft');  // Notify all students that the mentor has left

                // Clear the code block for new users
                codeBlockUsers[blockId] = [];

                // Update MongoDB to reflect that the mentor has left and reset the users
                await CodeBlock.findOneAndUpdate(
                    {blockId},
                    { isMentorPresent: false, usersOfCodeBlock: [] }  // Reset users and mentor presence
                );
            } else {
                // Remove the user from MongoDB CodeBlock usersOfCodeBlock array
                await CodeBlock.findOneAndUpdate(
                    {blockId},
                    { $pull: { usersOfCodeBlock: { socketIdUser: socket.id } } }  // Remove the user from the block
                );
            }

            // Update student count for all users in the block
            const studentCount = codeBlockUsers[blockId].filter(user => user.role === 'student').length;
            io.to(blockId).emit('studentCount', studentCount);
        });

        socket.on('mentorLeaveCodeBlock', async (blockId) => {
            console.log(`Mentor ${socket.id} has chosen to leave the code block ${blockId}`);

            // Emit 'mentorLeft' to all clients in the block, redirecting them to the lobby
            io.to(blockId).emit('mentorLeft');  // Notify all students that the mentor has left

            // Clear the code block for new users (reset the users of the code block)
            codeBlockUsers[blockId] = [];

            // Update MongoDB to reflect that the mentor has left and reset the users
            await CodeBlock.findOneAndUpdate(
                { blockId },
                { isMentorPresent: false, usersOfCodeBlock: [] }  // Reset users and mentor presence
            );

            console.log(`All students in block ${blockId} were redirected to the lobby.`);
        });
    });
});
