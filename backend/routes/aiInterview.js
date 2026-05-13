const express = require("express")
const { generateInterviewQuestions } = require("../services/geminiService")
const router = express.Router()

router.post("/start",async(req,res)=>{
    try {
        const{topic,difficulty} = req.body
        return res.status(200).json({
            success : true,
            message : "Ai route is working",
            topic,
            difficulty,
            question
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