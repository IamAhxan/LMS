import { app } from './app.js';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

// Cloudinary Config
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME as string,
        api_key: process.env.CLOUD_API_KEY as string,
        api_secret: process.env.CLOUD_SECRET_KEY as string,
    });


// Create Server

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});