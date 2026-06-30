import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis Connected");
        return process.env.REDIS_URL;
    }
    throw new Error("Redis Connection Failed");
}


export const redis = new Redis(redisClient());

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

redis.on('connect', () => {
    console.log('Redis client connected');
});
redis.on('reconnecting', (time: number) => {
    console.log(`Redis reconnecting in ${time}ms`);
});