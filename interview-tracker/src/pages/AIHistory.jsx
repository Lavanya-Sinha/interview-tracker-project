import { useState, useEffect } from "react";
import {useAuth} from '../hooks/useAuth'

const AIHistory = ()=>{
    const {token} = useAuth()
    const[sessions, setSessions] = useState([])
    useEffect(
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
        
       }), []
    )
    return(
      <div>
          <h1> AI history Page</h1>
      </div>    
    )
}
export default AIHistory 