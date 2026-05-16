const express = require("express")
const { generateInterviewQuestions, evaluateAnswer } = require("../services/groqService")
const authenticateToken = require("../middleware/authenticateToken")
const db = require("../db")
const router = express.Router()
router.post("/start", authenticateToken, (req,res)=>{
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

router.post("/evaluate", authenticateToken, (req,res)=>{
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

router.post("/create-session", authenticateToken, (req,res)=>{
    const{role, difficulty, conversation} = req.body
    const userId = req.user.user_id
    const sql = `INSERT INTO ai_session (user_id, role, difficulty, conversation) VALUES(?,?,?,?)`;
    db.query(sql,[userId, role, difficulty, JSON.stringify(conversation)], (err,result)=>{
        if(err){
            console.log("CREATE SESSION ERROR : ", err)
            return res.status(500).json({
                 success: false,
                 message: "Server error"
            })
        }
        return res.status(200).json({
            success : true,
            sessionId : result.insertId
        })
    })
})

router.put("/update-session/:id",authenticateToken, (req,res)=>{
    const sessionId = Number.parseInt(req.params.id)
    const {conversation} = req.body
    const sql = `UPDATE ai_session SET conversation = ? WHERE id = ?`
    db.query(sql,[JSON.stringify(conversation), sessionId],(err,result)=>{
        if(err){
            console.log("Update Session Error : ",err)
            return res.status(500).json({
                success : false,
                message : "Server Error"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Session Updated"
        })
    })

})

router.get("/sessions", authenticateToken, (req, res)=>{
    const userId = req.user.user_id
    const sql = `SELECT * FROM ai_session WHERE user_id = ? ORDER BY created_at DESC`
    db.query(sql,[userId],(err,result)=>{
        if(err){
           console.log("FETCH SESSION ERROR : ", err);
           return res.status(500).json({
            success : false,
            message : "Session Fetch Fail"
           })
        }
        return res.status(200).json({
            success : true,
            sessions : result
        })
    })
})

module.exports = router;