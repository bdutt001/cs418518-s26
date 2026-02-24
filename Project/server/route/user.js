import { Router } from "express";
import { connection } from "../database/connection.js";

const user = Router();


// =======================
// GET ALL USERS
// =======================
user.get("/", async (req, res) => {
    try {
        const [rows] = await connection.execute("SELECT * FROM user_info");

        res.status(200).json({
            status: 200,
            message: "Users fetched successfully",
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

// =======================
// GET USER BY ID
// =======================
user.get("/:id", async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT * FROM user_info WHERE u_id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: "User fetched successfully",
            data: rows[0]
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});



// =======================
// CREATE USER
// =======================
user.post("/", async (req, res) => {
    try {
        const {
            u_first_name,
            u_last_name,
            u_email,
            u_password,
            u_is_verified,
            u_is_admin
        } = req.body;

        if (!u_first_name || !u_last_name || !u_email || !u_password) {
            return res.status(400).json({
                status: 400,
                message: "Missing required fields",
                data: null
            });
        }

        const [result] = await connection.execute(
            `INSERT INTO user_info 
            (u_first_name, u_last_name, u_email, u_password, u_is_verified, u_is_admin)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                u_first_name,
                u_last_name,
                u_email,
                u_password,
                u_is_verified ?? 0,
                u_is_admin ?? 0
            ]
        );

        // console.log(result);

        res.status(201).json({
            status: 201,
            message: "User created successfully",
            data: { insertId: result.insertId }
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});



// =======================
// UPDATE USER
// =======================
user.put("/:id", async (req, res) => {
    try {
        const { u_first_name, u_last_name } = req.body;

        if (!u_first_name || !u_last_name) {
            return res.status(400).json({
                status: 400,
                message: "Missing required fields",
                data: null
            });
        }

        const [result] = await connection.execute(
            "UPDATE user_info SET u_first_name = ?, u_last_name = ? WHERE u_id = ?",
            [u_first_name, u_last_name, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "User updated successfully",
            data: { affectedRows: result.affectedRows }
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});


// =======================
// DELETE USER
// =======================
user.delete("/:id", async (req, res) => {
    try {
        const [result] = await connection.execute(
            "DELETE FROM user_info WHERE u_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "User deleted successfully",
            data: { affectedRows: result.affectedRows }
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