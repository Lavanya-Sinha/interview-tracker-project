const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAi.getGenerativeModel({
    model: "gemini-1.5-pro"
});

const generateInterviewQuestions = (topic,difficulty)=>{
const prompt = `Generate ONE ${difficulty} level interview question on ${topic}. Return only the question.`;
return model.generateContent(prompt)
.then((result)=>{
    return result.response.text()
})
}
module.exports = {
    generateInterviewQuestions
};