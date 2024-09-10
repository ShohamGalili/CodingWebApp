const express = require('express');
const {
    getAllCodeBlocks,
    getCodeBlock,
    createCodeBlock,
    deleteCodeBlock,
} = require('../controllers/codeBlockController');
const CodeBlock = require('../models/CodeBlockModel');  // Import the CodeBlock model

const router = express.Router();

router.get('/', getAllCodeBlocks);  // Get all code blocks
router.get('/:id', getCodeBlock);  // Get a single code block by ID
router.post('/', createCodeBlock);  // Create a new code block
router.delete('/:id', deleteCodeBlock);  // Delete a code block


// Update the code block content in real-time
router.put('/:id', async (req, res) => {
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
router.post('/:id/addUser', async (req, res) => {
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


module.exports = router;
