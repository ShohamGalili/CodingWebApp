const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeBlockSchema = new Schema({
    blockId: {
        type: String,
    },
    socketId: {
        type: String,
    },
    title: {
        type: String,
        required: true,  // Code block title (e.g., 'Async case', 'Promise example')
    },
    initialTemplate: {
        type: String,
        required: true,  // Initial template for the code block
    },
    solution: {
        type: String,
        required: true,  // Solution to the code block
    },
    currentContent: {
        type: String,  // The current content of the code block (updated in real-time)
    },
    usersOfCodeBlock: [
        {
            socketIdUser: {
                type: String,
                ref: 'User',  // Reference to the user on this code block
            },
            role: {
                type: String,
                enum: ['mentor', 'student'],  // Role: 'mentor' or 'student'
                required: true,
            },
        }
    ]
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema, 'CodeBlocks');
module.exports = CodeBlock;
