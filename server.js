require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT ||5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const db = mysql.createPool({
    uri: process.env.DB_URI,   
    waitForConnections: true,
    connectionLimit: 10
});

// Check connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
    connection.release();
});

// --- ROUTES ---

// 1. GET /projects - Fetch all projects
app.get('/projects', (req, res) => {
    const query = 'SELECT * FROM projects';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("DETAILED SQL ERROR:", err); // <--- Add this line!
            return res.status(500).json({ error: 'Database error fetching projects' });
        }
    });
});

// 2. POST /contact - Insert contact form data
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error saving message' });
        }
        res.status(201).json({ message: 'Message sent successfully!', id: result.insertId });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});