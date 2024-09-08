const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const codeBlockRoutes = require('./routes/codeBlocks');
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

// Routes
app.use('/api/codeBlocks', codeBlockRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Connected to MongoDB & listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Store users in each code block (code block ID => list of users)
const codeBlockUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining a code block
    socket.on('joinCodeBlock', (blockId) => {
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

        // Join the code block room
        socket.join(blockId);

        // Send the role to the user
        socket.emit('role', role);

        // Broadcast student count to all users in the code block
        io.to(blockId).emit('studentCount', codeBlockUsers[blockId].length);

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);

            // Remove user from code block
            codeBlockUsers[blockId] = codeBlockUsers[blockId].filter(user => user.socketId !== socket.id);

            // If mentor leaves, notify all users and reset the code block
            if (role === 'mentor') {
                io.to(blockId).emit('mentorLeft');
                codeBlockUsers[blockId] = [];  // Reset the code block for new users
            }

            // Update student count
            io.to(blockId).emit('studentCount', codeBlockUsers[blockId].length);
        });
    });
});
