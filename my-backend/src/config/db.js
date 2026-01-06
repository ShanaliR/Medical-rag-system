// src/config/db.js

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the URI from environment variables
        // The `useNewUrlParser` and `useUnifiedTopology` options are for preventing deprecation warnings
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Log a success message if the connection is established
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during connection, log the error message
        console.error(`Error: ${error.message}`);
        // Exit the process with a failure code
        process.exit(1);
    }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;
