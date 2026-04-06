import express from "express";
import { db } from "../database/connection.js";

const router = express.Router();

// ===============================
// GET: Advising History
// ===============================
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT id, created_at, current_term, status
       FROM advising_records
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch advising history" });
  }
});

// ===============================
// GET single record
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [[record]] = await db.query(
      `SELECT * FROM advising_records WHERE id = ?`,
      [id]
    );

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    const [courses] = await db.query(
      `SELECT * FROM advising_courses WHERE record_id = ?`,
      [id]
    );

    res.json({ record, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// ===============================
// POST create
// ===============================
router.post("/", async (req, res) => {
  try {
    const { userId, lastTerm, lastGpa, currentTerm, courses } = req.body;

    const [result] = await db.query(
      `INSERT INTO advising_records 
       (user_id, last_term, last_gpa, current_term) 
       VALUES (?, ?, ?, ?)`,
      [userId, lastTerm, lastGpa, currentTerm]
    );

    const recordId = result.insertId;

    for (let course of courses) {
      await db.query(
        `INSERT INTO advising_courses 
         (record_id, level, course_name) 
         VALUES (?, ?, ?)`,
        [recordId, course.level, course.course_name]
      );
    }

    res.json({ message: "Advising record created", status: "Pending" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create advising record" });
  }
});

// ===============================
// PUT update
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { lastTerm, lastGpa, currentTerm, courses } = req.body;

    const [[record]] = await db.query(
      `SELECT status FROM advising_records WHERE id = ?`,
      [id]
    );

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    if (record.status !== "Pending") {
      return res.status(403).json({ error: "Record is locked" });
    }

    await db.query(
      `UPDATE advising_records
       SET last_term = ?, last_gpa = ?, current_term = ?
       WHERE id = ?`,
      [lastTerm, lastGpa, currentTerm, id]
    );

    await db.query(
      `DELETE FROM advising_courses WHERE record_id = ?`,
      [id]
    );

    for (let course of courses) {
      await db.query(
        `INSERT INTO advising_courses 
         (record_id, level, course_name) 
         VALUES (?, ?, ?)`,
        [id, course.level, course.course_name]
      );
    }

    res.json({ message: "Record updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// ===============================
// DELETE
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `DELETE FROM advising_records WHERE id = ?`,
      [id]
    );

    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

export default router;