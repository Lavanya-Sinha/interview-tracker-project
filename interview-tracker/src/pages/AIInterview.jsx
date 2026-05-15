import { useState } from "react"
import { useLocation } from "react-router-dom";
const AIInterviews = ()=>{
    const [difficulty,setDifficulty] = useState("Intermediate")
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [followUpQuestion, setFollowUpQuestion] = useState("");
    const [questionLoading, setQuestionLoading] = useState(false);
    const [evaluationLoading, setEvaluationLoading] = useState(false);
    const location = useLocation();
    const role = location.state?.role;
    const startInterview = ()=>{
        setQuestionLoading(true);
        fetch("https://interview-tracker-project.onrender.com/api/ai/start",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                role,
                difficulty
            })
        })
         .then((response) => {

            return response.json();

        })

        .then((data) => {

            setQuestion(data.question);
            setQuestionLoading(false);

        })

        .catch((error) => {
         
            console.log("FRONTEND AI ERROR:", error);
            setQuestionLoading(false);

        });
    }

    const submitAnswer = () => {
      setEvaluationLoading(true);
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

      const result = data.result;

        const feedbackPart =
        result.split("FOLLOW_UP_QUESTION:")[0];

        const followUpPart =
        result.split("FOLLOW_UP_QUESTION:")[1];

       setFeedback(feedbackPart.replace("Feedback:", ""));

      setFollowUpQuestion(followUpPart);

      setEvaluationLoading(false);

    })

    .catch((error) => {
        console.log(
            "ANSWER SUBMISSION ERROR:", error);
    });

};

   return(
    <div className="min-h-screen bg-slate-900 text-white flex justify-center items-start p-8">

        <div className="w-full max-w-4xl space-y-6">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <h1 className="text-4xl font-bold mb-6">
                    AI Interview
                </h1>

                <div className="flex flex-col md:flex-row gap-4">

                <h2>AI Interview For : {role}</h2>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex-1 outline-none"
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



                    <button
                        onClick={startInterview}
                        disabled={questionLoading}
                        className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-500 hover:shadow-md transition-all duration-300"
                    >

                        {
                            questionLoading
                            ?
                            "Generating..."
                            :
                            "Start Interview"
                        }

                    </button>

                </div>

            </div>



            {
                question && (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

                        <h3 className="text-2xl font-semibold">
                            AI Question
                        </h3>

                        <p className="text-zinc-300 leading-7">
                            {question}
                        </p>

                    </div>
                )
            }



            {
                question && (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

                        <h3 className="text-2xl font-semibold">
                            Your Answer
                        </h3>

                        <textarea
                            placeholder="Type your answer..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full min-h-[180px] bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none resize-none text-zinc-200 leading-7"
                        />



                        <button
                            onClick={submitAnswer}
                            disabled={evaluationLoading}
                            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-500 hover:shadow-md transition-all duration-300"
                        >

                            {
                                evaluationLoading
                                ?
                                "Evaluating..."
                                :
                                "Submit Answer"
                            }

                        </button>

                    </div>
                )
            }



            {
                feedback && (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

                        <h3 className="text-2xl font-semibold">
                            AI Feedback
                        </h3>

                        <p className="text-zinc-300 leading-7">
                            {feedback}
                        </p>

                    </div>
                )
            }

              {
                followUpQuestion && (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

                        <h3 className="text-2xl font-semibold">
                            Follow-Up Question
                        </h3>

                        <p className="text-slate-300 leading-7">
                            {followUpQuestion}
                        </p>

                    </div>
                )
            }

        </div>

    </div>
)
}
export default AIInterviews