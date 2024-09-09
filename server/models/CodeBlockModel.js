const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeBlockSchema = new Schema({
    socketId: {
        type: String,
        auto: true,  // Automatically generated ID for each code block
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
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',  // Reference to the user on this code block
            },
            role: {
                type: String,
                enum: ['mentor', 'student'],  // Role: 'mentor' or 'student'
                required: true,
            },
        }
    ],
    isMentorPresent: {
        type: Boolean,
        default: false  // Boolean indicating whether the mentor is present
    }
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema, 'CodeBlocks');
module.exports = CodeBlock;
