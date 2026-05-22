import { PieChart, Cell, Pie, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
const Charts = ({ interviews, aiSessions }) => {
  const safeData = interviews || [];
  const [mounted, setMounted] = useState(false);

useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
}, []);

  const data = [
    {
      name: "Applied",
      value: safeData.filter(i => i.status === "Applied").length,
    },
    {
      name: "Offer",
      value: safeData.filter(i => i.status === "Offer").length,
    },
    {
      name: "Rejected",
      value: safeData.filter(i => i.status === "Rejected").length,
    },
  ];
  console.log("DATA:", data);
  console.log("RAW INTERVIEWS:", safeData);

  if (!mounted) return null;

  const scoredData = aiSessions.filter(session => session.average_score !== null).map((session)=>({
       date: new Date(session.created_at).toLocaleDateString(),
       score: Number(session.average_score)
  }))
console.log(scoredData);

return (
  <div className="space-y-6">
  <div className="bg-slate-800 p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Status Overview</h3>

    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
          data={data}
          dataKey="value"
           outerRadius={110}
           labelLine={false}
             label>
         {data.map((entry, index) => {
    const colors = ["#60a5fa80", "#4ade8080", "#f8717180"];
    return <Cell key={index} fill={colors[index]} />;
       })}
</Pie>
          <Tooltip
  contentStyle={{
    backgroundColor: "#1e293b", 
    border: "1px solid #334155", 
    borderRadius: "8px",
    color: "#e2e8f0", 
  }}
/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
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
                   <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
           )
         }
       </div>
  </div>
);
};

export default Charts;