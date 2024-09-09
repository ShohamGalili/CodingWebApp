const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB URI from .env
const uri = process.env.MONGO_URI;

// Define a simple schema and model for the test
const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const TestModel = mongoose.model('codeblocks', testSchema);

// Function to connect to MongoDB and add a value
async function addValueToDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Create a new document and save it
        const newTestValue = new TestModel({
            name: 'Test Value',
        });

        const savedDocument = await newTestValue.save();
        console.log('Document added:', savedDocument);

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error connecting to MongoDB or adding value:', error);
    }
}

// Run the function
addValueToDB();
