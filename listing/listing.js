const express = require('express');
const router = express.Router();
const pool = require('./db'); // your db connection

router.post('/add-listing', async (req, res) => {
  const { title, price, flatmates, area, contact, img } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO listings (title, price, flatmates, area, contact, img, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, price, flatmates, area, contact, img, 'Available']
    );
    res.json({ success: true, message: "Listing added successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding listing" });
  }
});

module.exports = router;
