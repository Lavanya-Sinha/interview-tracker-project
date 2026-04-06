const mysql = require("mysql2")
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "interview_tracker"
})
db.connect((err)=>{
    if(err){
        console.log("db connection failed",err)
    }
    else{
        console.log("Connected to Mysql db")
    }
})
module.exports = db