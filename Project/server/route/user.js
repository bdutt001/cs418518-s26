import { Router } from "express";
import { connection } from "../database/connection.js";

const user = Router();


//Get ALL users
user.get('/', async (req,res) => {
    try {
        const [rows] = await connection.execute("SELECT * FROM user_info");

        res.status(200).json({
            status: 200,
            message: "users fetched successfully",
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});

export default user;