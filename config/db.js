// Import mysql2 package
const mysql = require('mysql2');

// Import dotenv to read .env file
require('dotenv').config();

// Create a connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // localhost
  user: process.env.DB_USER,         // root
  password: process.env.DB_PASSWORD, // empty for XAMPP
  database: process.env.DB_NAME,     // hospital_db
});

// Convert pool to use promises (so we can use async/await)
const db = pool.promise();

// Export db so other files can use it
module.exports = db;