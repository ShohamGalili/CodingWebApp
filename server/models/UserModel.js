const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    socketId: {
        type: String,
        required: true,
    },
    currentCodeBlockId: {
        type: String,
        ref: 'CodeBlock',
        required: true,
    },
    solvedCodeBlocks: [{
        type: String,
        ref: 'CodeBlock'
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;