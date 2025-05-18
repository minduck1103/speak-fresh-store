const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        // Parse dbName from URI
        const dbUri = process.env.MONGODB_URI;
        const dbNameMatch = dbUri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
        const dbName = dbNameMatch ? dbNameMatch[1] : null;
        if (!dbName) {
            console.warn('⚠️  Connection string is missing database name! Please add your database name to the URI.');
        }
        const conn = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 