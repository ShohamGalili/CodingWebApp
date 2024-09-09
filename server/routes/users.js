const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();

// Create a new user and add them to a code block
router.post('/', async (req, res) => {
    try {
        const { currentCodeBlockId } = req.body;
        const newUser = new User({ currentCodeBlockId, solvedCodeBlocks: [] });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
