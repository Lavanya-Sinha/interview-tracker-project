const Stats = ({ interviews }) => {
  const safeInterviews = interviews || [];
  const total = safeInterviews.length;
  const applied = safeInterviews.filter(i => i.status === "Applied").length;
  const offer = safeInterviews.filter(i => i.status === "Offer").length;
  const rejected = safeInterviews.filter(i => i.status === "Rejected").length;
  const successRate = total === 0 ? 0 : Math.round((offer / total) * 100);

  const stats = [
    { label: "Total", value: total, color: "text-slate-100" },
  { label: "Applied", value: applied, color: "text-blue-400" },
  { label: "Offer", value: offer, color: "text-green-400" },
  { label: "Rejected", value: rejected, color: "text-red-400" },
  { label: "Success", value: `${successRate}%`, color: "text-blue-400" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-800 p-4 rounded-lg shadow-md"
        >
          <p className="text-slate-400 text-sm">{stat.label}</p>
          <p className={`text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;