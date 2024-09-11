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
    const { title, initialTemplate, solutionCode } = req.body;
    try {
        // Generate a unique socketId for the code block
        const socketId = generateUniqueSocketId();

        // Create and save the new CodeBlock instance
        const newCodeBlock = new CodeBlock({
            socketId,
            title,
            initialTemplate,
            solution: solutionCode,
            currentContent: initialTemplate,
            usersOfCodeBlock: []
        });

        await newCodeBlock.save();

        // Respond with the created socketId and a success message
        res.status(201).json({
            socketId: newCodeBlock.socketId,
            message: 'Code block created successfully'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Helper function to generate a unique socketId
const generateUniqueSocketId = () => {
    return `socket_${new Date().getTime()}`;  // Simple timestamp-based ID generator
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
