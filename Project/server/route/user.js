import { Router } from "express";
import { db } from "../database/connection.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { resend } from "../utils/email.js";

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
        const [rows] = await db.execute("SELECT * FROM user_info");

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

//======================
// VERIFY EMAIL
//======================
user.get("/verify-email", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Email required");
  }

  try {
    const [rows] = await db.execute(
      "SELECT u_is_verified FROM user_info WHERE u_email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).send("Invalid verification link");
    }

    if (rows[0].u_is_verified === 1) {
      return res.redirect(`${process.env.FE_ORIGIN}/login?verified=true`);
    }

    await db.execute(
      "UPDATE user_info SET u_is_verified = 1 WHERE u_email = ?",
      [email]
    );

    return res.redirect(`${process.env.FE_ORIGIN}/login?verified=true`);
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).send("Server error");
  }
});


// =======================
// CREATE USER / SIGNUP
// =======================
user.post("/", async (req, res) => {
  try {
    const { u_first_name, u_last_name, u_email, u_password } = req.body;

    if (!u_first_name || !u_last_name || !u_email || !u_password) {
      return res.status(400).json({ status: 400, message: "Missing required fields" });
    }

    const [existing] = await db.execute("SELECT * FROM user_info WHERE u_email = ?", [u_email]);
    if (existing.length > 0) {
      return res.status(400).json({ status: 400, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(u_password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const [result] = await db.execute(
      `INSERT INTO user_info (u_first_name, u_last_name, u_email, u_password, u_is_verified, u_is_admin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [u_first_name, u_last_name, u_email, hashedPassword, 0, 0]
    );

    //=========================
    // SEND VERIFICATION EMAIL
    //=========================
        const verificationUrl = `${process.env.BE_ORIGIN}/user/verify-email?email=${encodeURIComponent(
      u_email
    )}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: u_email,
        subject: "Verify your email",
        html: `
          <p>Hello ${u_first_name},</p>
          <p>Click the link below to verify your email:</p>
          <p><a href="${verificationUrl}">Verify Email</a></p>
        `,
      });
    } catch (emailErr) {
      console.error("Signup email failed:", emailErr);
    }

    return res.status(201).json({
      status: 201,
      message: "User registered. Please verify your email.",
      data: { u_id: result.insertId, u_email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

        const [result] = await db.execute(
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
        const [result] = await db.execute(
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

// ========================
// LOGIN API
// ========================
user.post("/login", async (req, res) => {
  try {
    const { u_email, u_password } = req.body || {};

    if (!u_email || !u_password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [rows] = await db.execute(
      "SELECT * FROM user_info WHERE u_email = ? LIMIT 1",
      [u_email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const userRecord = rows[0];

    if (userRecord.u_is_verified === 0) {
      return res.status(403).json({
        message: "Email not verified",
      });
    }

    const validPassword = await bcrypt.compare(
      u_password,
      userRecord.u_password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const { u_password: _, ...safeUser } = userRecord;

    const encodedUser = Buffer.from(JSON.stringify(safeUser)).toString(
      "base64"
    );

    const loginUrl = `${process.env.FE_ORIGIN}/complete-login?data=${encodeURIComponent(
      encodedUser
    )}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: u_email,
        subject: "Complete your login",
        html: `
          <p>Hello ${safeUser.u_first_name},</p>
          <p>Click below to complete login:</p>
          <p><a href="${loginUrl}">Complete Login</a></p>
        `,
      });
    } catch (emailErr) {
      console.error("Login email failed:", emailErr);
      return res.status(500).json({
        message: "Failed to send login email. Try again.",
      });
    }

    return res.status(200).json({
      message: "Login email sent. Check your inbox.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

//=======================
// CHANGE PASSWORD
//=======================
user.put("/change-password/:id", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        message: "Current and new passwords are required",
      });
    }

    const [rows] = await db.execute(
      "SELECT u_password FROM user_info WHERE u_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const storedHash = rows[0].u_password;

    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Current password is incorrect",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE user_info SET u_password = ? WHERE u_id = ?",
      [newHashedPassword, userId]
    );

    return res.status(200).json({
      status: 200,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
});

// =======================
// REQUEST PASSWORD RESET
// =======================
user.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const [rows] = await db.execute(
      "SELECT u_first_name FROM user_info WHERE u_email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.json({ message: "If the email exists, a reset link was sent." });
    }

    const user = rows[0];

    const resetLink = `${process.env.FE_ORIGIN}/reset-password`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.u_first_name},</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  } catch (emailErr) {
    console.error("Email failed:", emailErr);
  }

    return res.json({ message: "If the email exists, a reset link was sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

user.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) 
    return res.status(400).json({ message: "Email and new password required" });

  try {
    const [rows] = await db.execute(
      "SELECT u_id FROM user_info WHERE u_email = ?",
      [email]
    );

    if (rows.length === 0) 
      return res.status(404).json({ message: "User not found" });

    const userId = rows[0].u_id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE user_info SET u_password = ? WHERE u_id = ?",
      [hashedPassword, userId]
    );

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET USER BY ID
// =======================
user.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.execute(
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

export default user;