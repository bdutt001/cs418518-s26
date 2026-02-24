import { Router } from "express";
import { connection } from "../database/connection.js";

const user = Router();

/*
USER APIs sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/server/route/user.js
*/


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


//========================
//Login API
//========================
user.post("/login", async (req, res) => {
    try {
        // Debug (optional)
        // console.log("headers content-type:", req.headers["content-type"]);
        // console.log("body:", req.body);


        const { u_email, u_password } = req.body || {};

        // 1) Validate input
        if (!u_email || !u_password) {
            return res.status(400).json({
                status: 400,
                message: "Email and password are required",
                data: null,
            });
        }

        // 2) Query user by email
        const [rows] = await connection.execute(
            "SELECT * FROM user_info WHERE u_email = ? and u_password=? LIMIT 1",
            [u_email, u_password]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                status: 401,
                message: "Invalid email or password",
                data: null,
            });
        }

        const userRecord = rows[0];

        // 3) Password check (PLAIN TEXT version - for class demo only)
        if (userRecord.u_password !== u_password) {
            return res.status(401).json({
                status: 401,
                message: "Invalid email or password",
                data: null,
            });
        }

        // 4) Remove password before sending back
        const { u_password: _, ...safeUser } = userRecord;
        // const { u_password:_, u_is_admin,u_is_verified, ...safeUser } = userRecord;

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: safeUser,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
            data: null,
        });
    }
});

export default user;