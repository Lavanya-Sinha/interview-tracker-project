import { useState, useEffect, useRef } from "react"
import { useNavigate ,useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AIInterviews = ()=>{
    const {token} = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role;
    const restoredConversation = location.state?.conversation;
    const restoredSessionId = location.state?.sessionId;
    const restoredDifficulty = location.state?.difficulty;
    const [difficulty,setDifficulty] = useState(restoredDifficulty||"Intermediate")
    const [answer, setAnswer] = useState("");
    const [questionLoading, setQuestionLoading] = useState(false);
    const [evaluationLoading, setEvaluationLoading] = useState(false);
    const [conversation, setConversation] = useState(restoredConversation||[]);
    const [sessionId, setSessionId] = useState(restoredSessionId||null)
    const [isInterviewEnded, setIsInterviewEnded] = useState(false)
    const bottomRef = useRef(null)
    useEffect(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth"
       });
    }, [conversation]);
    const startInterview = ()=>{
        setQuestionLoading(true);
        fetch("https://interview-tracker-project.onrender.com/api/ai/start",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                 Authorization: `Bearer ${token}`
                
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

              const firstRound = [
                 {
                    question: data.question,
                    answer: "",
                    feedback: ""
                 }
                ];

console.log(firstRound);

setConversation(firstRound);

fetch("https://interview-tracker-project.onrender.com/api/ai/create-session",{
    method : "POST",
    headers : {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`
    },
    body : JSON.stringify({
        role,
        difficulty,
        conversation : firstRound
    })
})
.then((response)=> {
    return response.json()
})

.then((data)=>{
    setSessionId(data.sessionId)
})
            setQuestionLoading(false);

        })

        .catch((error) => {
         
            console.log("FRONTEND AI ERROR:", error);
            setQuestionLoading(false);

        });
    }

    const submitAnswer = () => {
      setEvaluationLoading(true);
      const currentQuestion = conversation[conversation.length - 1].question;
    fetch(
        "https://interview-tracker-project.onrender.com/api/ai/evaluate",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                question : currentQuestion,
                answer
            })
        }
    )

    .then((response) => {

        return response.json();

    })

    .then((data) => {
       
      const result = data.result;

        const feedbackPart = result.split("FOLLOW_UP_QUESTION:")[0];

        const followUpPart = result.split("FOLLOW_UP_QUESTION:")[1];
        
        const updatedConversation = [...conversation]
        const lastRound = updatedConversation[updatedConversation.length - 1]

        lastRound.answer = answer;

        lastRound.feedback = feedbackPart.replace("Feedback:", "");
         updatedConversation.push(
             {
                question: followUpPart,
                 answer: "",
                 feedback: ""
             }
            );
      setConversation(updatedConversation);

      fetch( `https://interview-tracker-project.onrender.com/api/ai/update-session/${sessionId}`,{
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
             Authorization: `Bearer ${token}`
        },
        body : JSON.stringify({
           conversation : updatedConversation
        })
      }
      )
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{
        console.log("Session Updated : ",data);
        
      })

      setAnswer("");
      setEvaluationLoading(false);

    })

    .catch((error) => {
        console.log(
            "ANSWER SUBMISSION ERROR:", error);
            setEvaluationLoading(false);
    });

};

   return(
    <div className="min-h-screen bg-slate-900 text-white flex justify-center items-start p-8">

        <div className="w-full max-w-4xl space-y-6">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold">
                         AI Interview
                    </h1>
                    <button onClick={() => {
                     navigate("/ai-history");
                      }}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-slate-600 hover:bg-white hover:text-slate-900 hover:border-blue-400 hover:shadow-[0_0_8px_rgba(96,165,250,0.6),0_0_16px_rgba(168,85,247,0.35)]" >
                         View History
                     </button>
                 </div>
                <div className="flex flex-col md:flex-row gap-4">

                 <div className="flex items-center gap-3">
                   <span className="text-zinc-400 text-sm">
                       Mock Interview For
                    </span>
                   <span className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded-full text-sm">
                        {role}
                     </span>
                </div>
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
             conversation.map((round, index) => (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
             key={index}
            >
            <h3 className="text-2xl font-semibold">
                AI Question
            </h3>
            <p className="text-zinc-300 leading-7">
                {round.question}
            </p>

             {
               round.answer && (
                   <div className="space-y-2">
                   <h3 className="text-xl font-semibold text-blue-400">
                         Your Answer :
                    </h3>
                   <p className="text-zinc-300 leading-7">
                       {round.answer}
                   </p>
               </div>
              )
            }

            {
               round.feedback && (
               <div className="space-y-2">
               <h3 className="text-xl font-semibold text-green-400">
                AI Feedback :
               </h3>
                <p className="text-zinc-300 leading-7">
                   {round.feedback}
               </p>
             </div>
             )
            }

            </div>
         ))
           }
          {
            isInterviewEnded &&(
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
                     <h2 className="text-3xl font-bold text-white"> 
                        Interview Completed.
                     </h2>
                     <p className="text-zinc-400">
                        Great Job Completing Your AI Mock Interview!
                     </p>
                </div>
            )
          }

           <div ref={bottomRef}></div>
            {
                conversation.length > 0 &&   !isInterviewEnded &&(

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

                        <h3 className="text-2xl font-semibold">
                            Your Answer
                        </h3>

                        <textarea
                            placeholder="Type your answer..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full min-h-[180px] bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none resize-none text-zinc-200 leading-7"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey){
                                     e.preventDefault();
                                      if (answer.trim() !== "" && !evaluationLoading) {
                                         submitAnswer();
                                        } 
                                     }
                                    }}
                        />

                      <div className="flex items-center gap-4">
                        <button
                            onClick={submitAnswer}
                            disabled={evaluationLoading || answer.trim() === ""}
                            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:shadow-md transition-all duration-300"
                        >

                            {
                                evaluationLoading
                                ?
                                "Evaluating..."
                                :
                                "Submit Answer"
                            }

                        </button>

                        <button onClick={()=>{
                            setIsInterviewEnded(true)
                        }}
                          className="bg-slate-700 text-white px-6 py-3 rounded-lg border border-slate-600 hover:bg-white hover:text-slate-900 hover:border-red-400 hover:shadow-[0_0_8px_rgba(248,113,113,0.45)] transition-all duration-300"
                        >
                          End Interview
                        </button>
                      </div>

                    </div>
                )
            }

        </div>

    </div>
)
}
export default AIInterviews