const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // your MySQL user
  password: 'mansi1234',      // your MySQL password
  database: 'pg_connect' // your DB name
});

module.exports = pool.promise(); // use async/await
