const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateInterviewQuestions = (
    role,
    difficulty
) => {

    return groq.chat.completions.create({

        messages: [
            {
                role: "user",
                content: ` Generate ONE ${difficulty} level interview question on ${role}.Return only the question.`
            }
        ],

        model: "llama-3.3-70b-versatile"

    })

    .then((chatCompletion) => {

        return chatCompletion.choices[0].message.content;

    });

};

const evaluateAnswer = (question, answer)=>{
return groq.chat.completions.create({
    messages : [
        {
            role : "user",
            content : `Interview Question : ${question} Candidate Answer : ${answer} 
            Evaluate the answer briefly.
            Then generate ONE follow-up question.
           Format response EXACTLY like this:
           SCORE : [1-10]
            Feedback:
            <feedback>
            FOLLOW_UP_QUESTION:
            <question>
            Do not change the labels.`
        }
    ],
       model: "llama-3.3-70b-versatile"
})
.then((chatCompletion)=>{
    return chatCompletion
    .choices[0]
    .message
    .content
})
}

module.exports = {
    generateInterviewQuestions,
    evaluateAnswer
};