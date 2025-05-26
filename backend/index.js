import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
dotenv.config()

const app = express()
const db_url = process.env.DB_URL

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


// Connect to MongoDB with debug
async function main() {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // 10 seconds
        });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
    }
}

// Log connection events
mongoose.connection.on('connected', () => {
    console.log('✅ [Mongoose] Connection established');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ [Mongoose] Error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [Mongoose] Disconnected from DB');
});

main();











// Start server
app.listen(8080, () => {
    console.log('🚀 Server is running on port 8080');
});