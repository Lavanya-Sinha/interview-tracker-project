const jwt = require("jsonwebtoken")

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
module.exports = authenticateToken