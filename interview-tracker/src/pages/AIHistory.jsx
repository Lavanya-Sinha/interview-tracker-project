import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../hooks/useAuth'
import {useToast} from '../hooks/useToast'
const AIHistory = ()=>{
    const {token} = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
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
           toast(
            {
            title: "Session Deleted",
            description: "AI interview session removed successfully."}
            );
    })

    .catch((error) => {
        console.log("DELETE SESSION ERROR:", error);
           toast({
             title: "Session Deleted",
             description:"AI interview session removed successfully."
              });
      });
}
    return(
     <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-8">
           AI Interview History
        </h1>

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

</div>
    )
}
export default AIHistory 