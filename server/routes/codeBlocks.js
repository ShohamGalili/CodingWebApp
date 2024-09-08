const express = require('express');
const {
    getAllCodeBlocks,
    getCodeBlock,
    createCodeBlock,
    deleteCodeBlock
} = require('../controllers/codeBlockController');

const router = express.Router();

router.get('/', getAllCodeBlocks);  // Get all code blocks
router.get('/:id', getCodeBlock);  // Get a single code block by ID
router.post('/', createCodeBlock);  // Create a new code block
router.delete('/:id', deleteCodeBlock);  // Delete a code block

module.exports = router;
