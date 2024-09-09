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
    const { title, description, initialTemplate, solutionCode } = req.body;
    try {
        // Create a new CodeBlock instance with the given data
        const newCodeBlock = new CodeBlock({
            title,                             // Code block title
            description,                       // Code block description
            initialTemplate,                   // Initial code template
            solution: solutionCode,            // Solution code for the block
            currentContent: initialTemplate,   // Set the initial content to the template
            usersOfCodeBlock: []               // Empty array for users, initially
        });

        // Save the new code block (MongoDB automatically generates ObjectId)
        await newCodeBlock.save();

        // Send the ObjectId and a success message back to the frontend
        res.status(201).json({
            _id: newCodeBlock._id,  // MongoDB generated ObjectId
            message: 'Code block created successfully'
        });
    } catch (error) {
        // If an error occurs, send a 400 status with the error message
        res.status(400).json({ error: error.message });
    }
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
