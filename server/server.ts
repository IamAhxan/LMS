import { app } from './app.js';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
dotenv.config();

// Create Server

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});