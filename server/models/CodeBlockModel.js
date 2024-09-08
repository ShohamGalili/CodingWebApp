const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const codeBlockSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    initialCode: {
        type: String,
        required: true  // Code block starting template
    },
    solutionCode: {
        type: String,
        required: true  // Solution code for this block
    }
}, { timestamps: true });

module.exports = mongoose.model('CodeBlock', codeBlockSchema);
