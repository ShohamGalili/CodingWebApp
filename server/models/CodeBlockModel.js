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
        required: true,  // Code block title
    },
    initialTemplate: {
        type: String,
        required: true,  // Initial code template for the block
    },
    solution: {
        type: String,
        required: true,  // Correct solution to the block
    },
    currentContent: {
        type: String,  // The current code content, updated in real-time
    },
    usersOfCodeBlock: [
        {
            socketIdUser: {
                type: String,
                ref: 'User',  // Reference to the user
            },
            role: {
                type: String,
                enum: ['mentor', 'student'],  // Role of the user in the session
                required: true,
            },
        }
    ]
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema, 'CodeBlocks');
module.exports = CodeBlock;
