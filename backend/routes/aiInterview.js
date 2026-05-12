const express = requre("express.js")
const router = express.Router()

router.post("/start",async(req,res)=>{
    try {
        const{topic,difficulty} = req.body
        return res.status(200).json({
            success : true,
            message : "Ai route is working",
            topic,
            difficulty,
            question: "What is memoization in React?"
        })
        
    } catch (error) {
        console.log("AI START ERROR : ",error);
        return res.status(500).json({
            success : false,
            message : "Server error"
        })
        
    }
})
module.exports = router;