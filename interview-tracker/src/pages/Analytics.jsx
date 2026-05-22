import Layout from "../components/layout/Layout";
import Charts from "../components/ui/Charts";
import useAllInterviews from "../hooks/useAllInterviews";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const Analytics = () => {
    const { interviews, loading } = useAllInterviews();
    const [aiSessions, setAISessions] = useState([]);
    const { token } = useAuth();
    useEffect(()=>{
  fetch("https://interview-tracker-project.onrender.com/api/ai/sessions",
    {
      headers : {
           Authorization: `Bearer ${token}`
      }
    }
  )
  .then((response)=>response.json())
  .then((data)=>{
    setAISessions(data.sessions)
  })
  .catch((err)=>{
    console.log("FETCH AI SESSIONS ERROR: ",err);
  })
},[token])

    if (loading) {
  return <p className="text-slate-400">Loading analytics...</p>;
}
const getLocalDate = (timestamp) => {
  const date = new Date(timestamp);
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
};
  const today = getLocalDate(new Date());
const calculateStreak = (interviews) => {
  if (!interviews.length) return 0;

  const days = interviews.map(i =>
  getLocalDate(i.created_at)
);

  const uniqueDays = [...new Set(days)].sort().reverse();

  if (uniqueDays[0] !== today) return 0;

  let streak = 1;

  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const current = new Date(uniqueDays[i]);
    const next = new Date(uniqueDays[i + 1]);

    const diff = (current - next) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;

};

const streak = calculateStreak(interviews);

const completedAIInterviews = aiSessions.filter(session => session.is_completed).length 
const activeAIInterviews = aiSessions.filter(session => !session.is_completed).length;
const scoredSessions = aiSessions.filter( session => session.average_score !== null)
const averageAIScore = scoredSessions.length > 0? (
   scoredSessions.reduce((sum, session)=> sum + Number(session.average_score),0) / scoredSessions.length
).toFixed(2) : "0.00"

const bestAIScore = scoredSessions.length > 0? Math.max(
   ...scoredSessions.map(
          session => Number(session.average_score))
).toFixed(2) : "0.00"

   return (
  <Layout>
    <div className="max-w-5xl mx-auto w-full">
        <p className="text-sm text-slate-400 mb-6">
  Visual overview of your interview performance
</p>

      <h2 className="text-xl font-semibold mb-6 tracking-tight">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Charts interviews={interviews} />

        {/* Summary Card */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Insights</h3>

        <div className="space-y-3">
  <div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
    <span className="text-slate-400">Total</span>
    <span className="text-slate-100 font-medium">
      {interviews.length}
    </span>
  </div>

  <div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
    <span className="text-blue-400">Applied</span>
    <span className="font-semibold text-slate-100">{interviews.filter(i => i.status === "Applied").length}</span>
  </div>

  <div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
    <span className="text-green-400">Offer</span>
    <span className="font-semibold text-slate-100">{interviews.filter(i => i.status === "Offer").length}</span>
  </div>

  <div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
    <span className="text-red-400">Rejected</span>
    <span className="font-semibold text-slate-100">{interviews.filter(i => i.status === "Rejected").length}</span>
  </div>
  <div className="flex justify-between items-center px-2 py-1 rounded hover:bg-slate-700/50 transition">
  <span className="text-orange-300 font-semibold tracking-wide">
    🔥 <span>Streak</span>
  </span>

  <span className="text-orange-300 font-semibold">
    {streak} {streak === 1 ? "day" : "days"}
  </span>
</div>
</div>

<div className="border-t border-slate-700 my-3"></div>
<div  className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
<span className="text-cyan-400">AI Completed</span>
 <span className="font-semibold text-slate-100">
    {completedAIInterviews}
  </span>
</div>

<div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
  <span className="text-purple-400">AI Active</span>
   <span className="font-semibold text-slate-100">
    {activeAIInterviews}
   </span>
</div>

<div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
   <span className="text-blue-400">Average Score</span>
     <span className="font-semibold text-slate-100">
       {averageAIScore}
     </span>
</div>

<div className="flex justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/50 transition">
 <span className="text-green-400">Best Score</span>
 <span className="font-semibold text-slate-100">
    {bestAIScore}
  </span>
</div>

        </div>

      </div>

    </div>
  </Layout>
);
};

export default Analytics;
