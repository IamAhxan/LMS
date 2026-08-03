import mongoose from "mongoose";
const connectDB = async () => {
    const dbUrl = process.env.DB_URI || "";
    try {
        await mongoose.connect(dbUrl).then((data) => {
            console.log(`MongoDB connected with server: ${data.connection.host}`);
        });
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        setTimeout(connectDB, 5000); // Retry connection after 5 seconds
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map