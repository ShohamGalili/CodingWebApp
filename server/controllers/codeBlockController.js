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
    const { title, description, initialCode, solutionCode } = req.body;
    try {
        const codeBlock = await CodeBlock.create({ title, description, initialCode, solutionCode });
        res.status(201).json(codeBlock);
    } catch (error) {
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
