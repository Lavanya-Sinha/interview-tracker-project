import { useState } from "react"
const AIInterviews = ()=>{
    const[topic,setTopic] = useState("React")
    const [difficulty,setDifficulty] = useState("Intermediate")
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const startInterview = ()=>{
        fetch("https://interview-tracker-project.onrender.com/api/ai/start",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                topic,
                difficulty
            })
        })
         .then((response) => {

            return response.json();

        })

        .then((data) => {

            setQuestion(data.question);

        })

        .catch((error) => {

            console.log("FRONTEND AI ERROR:", error);

        });
    }

    const submitAnswer = () => {

    fetch(
        "https://interview-tracker-project.onrender.com/api/ai/evaluate",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question,
                answer
            })
        }
    )

    .then((response) => {

        return response.json();

    })

    .then((data) => {

        setFeedback(data.result);

    })

    .catch((error) => {

        console.log(
            "ANSWER SUBMISSION ERROR:",
            error
        );

    });

};

    return(
         <div>

            <h1>AI Interview</h1>

            <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            >
                <option value="React">React</option>

                <option value="JavaScript">
                    JavaScript
                </option>

                <option value="Node.js">
                    Node.js
                </option>
            </select>

            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
                <option value="Beginner">
                    Beginner
                </option>

                <option value="Intermediate">
                    Intermediate
                </option>

                <option value="Advanced">
                    Advanced
                </option>
            </select>

            <button onClick={startInterview}>
                Start Interview
            </button>

            {
                question && (

                    <div>

                        <h3>AI Question:</h3>

                        <p>{question}</p>

                    </div>
                )
            }
            <textarea
             placeholder="Type your answer..."
             value={answer}
             onChange={(e) => setAnswer(e.target.value)}
             />
             <button onClick={submitAnswer}>
              Submit Answer
             </button>
                {
                  feedback && (
                 <div>
                  <h3>AI Feedback:</h3>
                  <p>{feedback}</p>
                  </div>
                    )
                 }

        </div>
    )
}
export default AIInterviews