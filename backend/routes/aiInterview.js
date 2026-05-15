const express = require("express")
const { generateInterviewQuestions, evaluateAnswer } = require("../services/groqService")
const router = express.Router()

router.post("/start", (req,res)=>{
        const{role,difficulty} = req.body
        generateInterviewQuestions(role, difficulty)

        .then((question) => {

            return res.status(200).json({
                success: true,
                question
            });

        }) 
         .catch((error) => {

            console.log("AI START ERROR :", error);

            return res.status(500).json({
                success: false,
                message: "Server error"
            });

        });
})

router.post("/evaluate", (req,res)=>{
    const{question, answer} = req.body
    evaluateAnswer(question,answer)
     .then((result) => {

            return res.status(200).json({
                success: true,
                result
            });

        })

        .catch((error) => {

            console.log("EVALUATION ERROR :", error);

            return res.status(500).json({
                success: false,
                message: "Evaluation failed"
            });

        });
})

module.exports = router;