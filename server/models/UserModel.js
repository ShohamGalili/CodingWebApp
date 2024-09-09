const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    currentCodeBlockId: {
        type: Schema.Types.ObjectId,
        ref: 'CodeBlock',
        required: true,
    },
    solvedCodeBlocks: [{
        type: Schema.Types.ObjectId,
        ref: 'CodeBlock'
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;