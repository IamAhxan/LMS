import { app } from './app.js';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import { v2 as cloudinary } from 'cloudinary';
import http from 'http';
import { initSocketServer } from './socketServer.js';
// 1. Create the HTTP server using your Express app
const server = http.createServer(app);
dotenv.config();
// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
// 2. Attach Socket.IO to the HTTP server
initSocketServer(server);
// 3. Start the HTTP server (NOT app.listen)
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});
//# sourceMappingURL=server.js.map