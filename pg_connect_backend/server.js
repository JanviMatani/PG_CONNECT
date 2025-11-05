// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// ====== Middleware ======
app.use(cors());
app.use(express.json()); // for parsing JSON bodies
// Serve static files from frontend/images directory
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// ====== MySQL Connection ======
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,        // your MySQL user
    password: process.env.DB_PASSWORD,        // your MySQL password
    database: process.env.DB_NAME2,
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// ====== Routes ======

// Get all flats
app.get('/api/flats', (req, res) => {
    const query = 'SELECT * FROM flats';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get cart for a user
app.get('/api/cart/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const query = `
        SELECT c.flat_id, f.title, f.price, f.rating, f.flatmates, f.area, f.status, f.img
        FROM cart c
        JOIN flats f ON c.flat_id = f.id
        WHERE c.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add flat to cart
app.post('/api/cart', (req, res) => {
    const { user_id, flat_id } = req.body;

    // Check if already in cart
    const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND flat_id = ?';
    db.query(checkQuery, [user_id, flat_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.json({ success: false, message: 'Already in cart' });
        }

        // Insert into cart
        const insertQuery = 'INSERT INTO cart (user_id, flat_id) VALUES (?, ?)';
        db.query(insertQuery, [user_id, flat_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Added to cart' });
        });
    });
});

// ====== Start Server ======
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
