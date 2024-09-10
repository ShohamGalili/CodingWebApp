const CodeBlock = require('../models/CodeBlockModel');

// Get all code blocks
const getAllCodeBlocks = async (req, res) => {
    try {
        const codeBlocks = await CodeBlock.find({});
        res.status(200).json(codeBlocks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single code block by ID
const getCodeBlock = async (req, res) => {
    const { id } = req.params;
    try {
        const codeBlock = await CodeBlock.findById(id);
        if (!codeBlock) {
            return res.status(404).json({ error: 'Code block not found' });
        }
        res.status(200).json(codeBlock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new code block
const createCodeBlock = async (req, res) => {
    const { title, initialTemplate, solutionCode } = req.body; // Ensure these fields come from the frontend
    try {
        // Generate a random socketId (you can also use UUID or other unique string methods)
        const socketId = generateUniqueSocketId();  // You would define this function to generate unique IDs

        // Create a new CodeBlock instance with the given data
        const newCodeBlock = new CodeBlock({
            socketId,                          // Use the generated socketId
            title,                             // Code block title
            initialTemplate,                   // Initial code template
            solution: solutionCode,            // Solution code for the block
            currentContent: initialTemplate,   // Set the initial content to the template
            usersOfCodeBlock: []               // Empty array for users, initially
        });

        // Save the new code block (MongoDB will use socketId instead of _id)
        await newCodeBlock.save();

        // Send the socketId and a success message back to the frontend
        res.status(201).json({
            socketId: newCodeBlock.socketId,
            message: 'Code block created successfully'
        });
    } catch (error) {
        // If an error occurs, send a 400 status with the error message
        res.status(400).json({ error: error.message });
    }
};

// Helper function to generate a unique socketId (you can use any strategy here)
const generateUniqueSocketId = () => {
    // For example, using a simple date-based string, but it's recommended to use something like UUID
    return `socket_${new Date().getTime()}`;
};


// Delete a code block
const deleteCodeBlock = async (req, res) => {
    const { id } = req.params;
    try {
        const codeBlock = await CodeBlock.findByIdAndDelete(id);
        if (!codeBlock) {
            return res.status(404).json({ error: 'Code block not found' });
        }
        res.status(200).json({ message: 'Code block deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllCodeBlocks,
    getCodeBlock,
    createCodeBlock,
    deleteCodeBlock
};
