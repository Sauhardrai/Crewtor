import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import dashRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';
import cors from 'cors';
import paymentRoutes from './routes/payment.js'
const app = express();

 const db_url = process.env.MONGO_URI
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

app.get('/home', (req,res)=>{
    res.status(200).json({message:"sever connacted"})
});

app.use('/api/auth' , authRoutes);
app.use('/api/dash', dashRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment',paymentRoutes);





app.listen(8080, () => {
    console.log('🚀 Server is running on port 8080');
});