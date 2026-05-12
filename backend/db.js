const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("db connection failed", err);
  } else {
    console.log("Connected to Mysql db");
    connection.release();
  }
});

module.exports = db;