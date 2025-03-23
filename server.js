const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",  
    password: "********", 
    database: "todo_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ MySQL Connected!");
});

app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;
    db.query("INSERT INTO tasks (title) VALUES (?)", [title], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, title, status: "pending" });
    });
});

app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE tasks SET status = 'completed' WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.json({ message: "Task marked as completed" });
    });
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.json({ message: "Task deleted" });
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
