const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateInterviewQuestions = (
    topic,
    difficulty
) => {

    return groq.chat.completions.create({

        messages: [
            {
                role: "user",
                content: ` Generate ONE ${difficulty} level interview question on ${topic}.Return only the question.`
            }
        ],

        model: "llama-3.3-70b-versatile"

    })

    .then((chatCompletion) => {

        return chatCompletion.choices[0].message.content;

    });

};

module.exports = {
    generateInterviewQuestions
};