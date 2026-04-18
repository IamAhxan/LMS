import mongoose from "mongoose";




const connectDB = async () => {
    const dbUrl: string = process.env.DB_URI! || "";
    try {
        await mongoose.connect(dbUrl).then((data: any) => {
            console.log(`MongoDB connected with server: ${data.connection.host}`);
        });
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        setTimeout(connectDB, 5000); // Retry connection after 5 seconds
    }
}

export default connectDB;