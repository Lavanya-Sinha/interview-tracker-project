const mysql = require("mysql2");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// test connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("db connection failed", err);
  } else {
    console.log("Connected to Mysql db ✅");
    connection.release();
  }
});

module.exports = db;