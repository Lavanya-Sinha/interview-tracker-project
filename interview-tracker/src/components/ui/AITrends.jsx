import {  Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const AITrends = ({aiSessions})=>{
      const scoredData = aiSessions.filter(session => session.average_score !== null).map((session)=>({
       date: new Date(session.created_at).toLocaleDateString(),
       score: Number(session.average_score)
  }))
    return(
<div className="space-y-6">
 <div className="bg-slate-800 mt-10% p-6 rounded-lg shadow-md">
         <h3 className="text-lg font-semibold mb-4">
          AI Performance Trend
         </h3>
         {
           scoredData.length === 0 ? (
            <p className="text-slate-400">
              No AI interview data available yet.
            </p>
           ) : (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%"  height="100%">
                <LineChart data={scoredData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="date" />
                   <YAxis  domain={[0,10]} ticks={[0,2,4,6,8,10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
           )
         }
       </div>
</div>
    )
}
export default AITrends