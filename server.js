require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use(express.static('.'));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('SQL State:', err.sqlState);
        throw err;
    }
    console.log(`MySQL connected to database: ${process.env.DB_NAME}`);
});

// Check if email exists
app.post('/check-email', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email.toLowerCase()], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ exists: results.length > 0 });
    });
});

// Register new user
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                 [username, email.toLowerCase(), hashedPassword], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'User registered successfully' });
        });
    });
});

// Login user
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        if (results.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }
        
        const user = results[0];
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        
        res.json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
