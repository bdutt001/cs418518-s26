import 'dotenv/config';
import mysql from 'mysql2/promise';

export const connection = async () => {
    try {
        const createConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            // port: process.env.DB_PORT || 3306 
        });

        console.log("✅ Connected to database");
        return createConnection;
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        throw err;
    }
};