const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,        // your MySQL user
    password: process.env.DB_PASSWORD,        // your MySQL password
    database: process.env.DB_NAME2,
});

module.exports = pool.promise(); // use async/await
