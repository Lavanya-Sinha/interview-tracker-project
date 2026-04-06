const db = require("./db")
require("./websocket")
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const app = express()
app.use(cors())
app.use(express.json())

// AUTHENTICATION
const authenticateToken = (req,res,next)=>{
   const authHeader = req.headers["authorization"]
   if(!authHeader){
    return res.status(401).json({ message: "No token" });
   }
   const parts = authHeader.split(" ")
   const token = parts[1]
   if (!token) {
  return res.status(401).json({ message: "Invalid token" });
}
console.log("TOKEN:", token);
   jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
     console.log("TOKEN RECEIVED:", token);
     console.log("ERROR:", err);
     console.log("USER:", user);
    if(err){
        console.log(err)
        return res.status(401).json({message : "Unauthorized User"})
    }
    req.user = user
    next()
   })
}
app.get("/", (req,res)=>{
    res.send("server is running")
})
app.get("/interviews", authenticateToken, (req, res) => {
  const userId = req.user.user_id;

  const { page = 1, limit = 5, search = "" } = req.query;
  const offset = (page - 1) * limit;

  let baseQuery = "FROM interviews WHERE user_id = ?";
  let params = [userId]; 

  if (search) {
    baseQuery += " AND company LIKE ?"; 
    params.push(`%${search}%`);
  }

  const dataQuery = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  db.query(countQuery, params, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const total = countResult[0].total;

    db.query(
      dataQuery,
      [...params, Number(limit), Number(offset)],
      (err, results) => {
        if (err) return res.status(500).json(err);

        res.json({
          data: results,
          total: total
        });
      }
    );
  });
});
app.post("/interviews", authenticateToken, (req, res) => {
  const { company, role, status, createdAt } = req.body;
   const userId = req.user.user_id
  const sql = "INSERT INTO interviews (company, role, status, user_id, created_at) VALUES (?, ?, ?, ?, ?)";
   console.log("USER: ",req.user.user_id)
  db.query(sql, [company, role, status,userId,  createdAt || Date.now()], (err, result) => {
    if (err) {
     res.status(500).json(err);
    }
    if(globalThis.wss){
        console.log("Broadcast working");
        
       globalThis.wss.clients.forEach((client)=>{
        if (client.readyState === 1) {
            client.send(JSON.stringify({
                type : "INTERVIEW_ADDED"
            }))
        }
       })
    }
    res.json(result)
  });
});
app.delete("/interviews/:id", authenticateToken, (req,res)=>{
    const userId = req.user.user_id
    const id = Number.parseInt(req.params.id)
    const sql = "DELETE FROM interviews WHERE id = ? AND user_id = ?"
    console.log("The USER is : ",req.user.user_id)
    db.query(sql,[id,userId],(err,results)=>{
        if(err){
            res.status(500).json(err)
        }
        else{
            db.query("SELECT * FROM interviews", (err, results)=>{
                if(err){
                    res.status(500).json(err)
                }
               if (globalThis.wss) {
                 globalThis.wss.clients.forEach((client) => {
                  if (client.readyState === 1) {
                    client.send(JSON.stringify({
                    type: "INTERVIEW_DELETED" 
                }));
               }
            });
}
 res.json({ message: "Deleted successfully" });
            })
        }
    })
})
app.put("/interviews/:id", authenticateToken, (req,res)=>{
    const userId = req.user.user_id
    const id = Number.parseInt(req.params.id)
    const {company,role,status} = req.body
    const sql = "UPDATE interviews SET company = ?, role = ?, status =? WHERE id = ? AND user_id = ?"
    db.query(sql,[company,role,status,id,userId],(err,result)=>{
        if(err){
            res.status(500).json(err)
        }
        else{
            db.query("SELECT * FROM interviews", (err,results)=>{
                if(err){
                    res.status(500).json(err)
                }
                if (globalThis.wss) {
                  globalThis.wss.clients.forEach((client) => {
                    if (client.readyState === 1) {
                      client.send(JSON.stringify({
                        type: "INTERVIEW_UPDATED"
                      }));
                    }
                  });
                }
                    res.json({message : "UPDATE DONE"})
            })
        }
    })
})
app.get("/interviews/search", (req,res)=>{
    const search = req.query.q
    const sql = `SELECT * FROM interviews WHERE company LIKE ? OR role LIKE ?`
    const value = `%${search}%`

    db.query(sql,[value,value], (err,results)=>{
        if(err){
            res.status(500).json(err)
        }
        res.json(results)
    })
})

//USER ACTIVITIES

app.post("/sign-up", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
          console.log("SIGNUP ERROR:", err);
        return res.status(500).json({ message: err.message });
      }

      res.json({ message: "User signed up successfully" });
    });

  } catch (error) {
    res.status(500).json({ message: "Error hashing password" });
  }
});

app.post("/login",(req,res)=>{
    const {email,password} = req.body
    const sql = "SELECT * FROM users WHERE email = ?"
    db.query(sql,[email],async(err,result)=>{
        if(err){
            return res.status(500).json({message:"Sever Error"})
        }
        if(result.length === 0){
            return res.status(401).json({message : "Invalid credentials or an error"})
        }
        const user = result[0]
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message : "Invalid credentials"})
        }
        const token = jwt.sign(
            {user_id : user.id},
            process.env.JWT_SECRET
        )
        res.json({token})
    })
})
const PORT = 5000
app.listen(PORT, ()=>{
    console.log("server is running in 5000 port")
})