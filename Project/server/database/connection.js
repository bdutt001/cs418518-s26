import 'dotenv/config';
import mysql from 'mysql2/promise';

console.log("SMTP CONFIG:");
console.log("HOST:", process.env.SMTP_HOST);
console.log("PORT:", process.env.SMTP_PORT);
console.log("USER:", process.env.SMTP_USER);
console.log("PASS exists:", !!process.env.SMTP_PASS);

export const db = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_ADDON_HOST,
  user: process.env.DB_USER || process.env.MYSQL_ADDON_USER,
  password: process.env.DB_PASSWORD || process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.DB_NAME || process.env.MYSQL_ADDON_DB,
  port: process.env.DB_PORT || process.env.MYSQL_ADDON_PORT || 3306,
});