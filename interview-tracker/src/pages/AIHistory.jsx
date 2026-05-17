import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../hooks/useAuth'
import useToast from '../hooks/useToast'

const AIHistory = ()=>{
    const {token} = useAuth()
    const navigate = useNavigate()
   const { showToast } = useToast();
    const[sessions, setSessions] = useState([])
    useEffect(()=>{
        fetch( "https://interview-tracker-project.onrender.com/api/ai/sessions",
            {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            console.log(data.sessions);
            setSessions(data.sessions)
        })
       .catch((err)=>{
        console.log("FETCH SESSION ERROR : ", err);
        
       }) 
},[token])

const handleDeleteSession = (id)=>{
    fetch(`https://interview-tracker-project.onrender.com/api/ai/session/${id}`,
        {
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
    )
     .then((response) => {

        return response.json();

    })

    .then(()=>{
        const updateSessions = sessions.filter((session)=>{
            return session.id !== id
        })
        setSessions(updateSessions)
           showToast("Session deleted");
    })

    .catch((error) => {
        console.log("DELETE SESSION ERROR:", error);
          showToast("Something went wrong");
      });
}
    return(
     <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-8">
           AI Interview History
        </h1>

{
sessions.length === 0 ? (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center space-y-4">
      <h2 className="text-3xl font-bold text-white">
        No AI Interviews Yet.
      </h2>
      <p className="text-zinc-400">
        Start Your First AI Mock Interview To Begin Your Preparation!
      </p>
      <button onClick={()=>{
        navigate("/ai-interview")
      }}
       className="bg-slate-700 text-white px-6 py-3 rounded-lg transition-all duration-300 border border-slate-600 hover:bg-white hover:text-slate-900 hover:border-blue-400 hover:shadow-[0_0_8px_rgba(96,165,250,0.6),0_0_16px_rgba(168,85,247,0.35)]"
      >
        Start Interview
      </button>
    </div>
): (
     <div className="space-y-6">
        {
            sessions.map((session) => (
                <div key={session.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3 cursor-pointer hover:border-blue-500 transition-all" 
                onClick={()=>{
                    navigate('/ai-interview', {
                        state : {
                            role : session.role,
                            difficulty : session.difficulty,
                            sessionId : session.id,
                            conversation : JSON.parse(session.conversation)
                        }
                    })
                 } }
                >

                    <h2 className="text-2xl font-semibold">
                        {session.role}
                    </h2>

                    <p className="text-zinc-300">
                        Difficulty: {session.difficulty}
                    </p>

                    <p className="text-zinc-400 text-sm">
                        {
                            new Date(
                                session.created_at
                            ).toLocaleString()
                        }
                    </p>
                    <div className="flex justify-end">
                      <button onClick={(e) => {
                         e.stopPropagation();
                          handleDeleteSession(session.id);
                         }}
                          className="bg-red-900 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition" >
                            Delete 
                        </button>
                    </div>
                </div>
            ))
        }
    </div>
)
}

</div>
    )
}
export default AIHistory 