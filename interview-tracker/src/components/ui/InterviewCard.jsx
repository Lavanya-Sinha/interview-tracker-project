import { useState } from "react";

const InterviewCard = ({ interview, handleDelete, handleUpdate, handleToggleFavorite }) => {
  let statusColors = {
    Applied: "bg-blue-500/10 text-blue-400",
    Offer: "bg-green-500/10 text-green-400",
    Rejected: "bg-red-500/10 text-red-400",
  };

  const statusColor = statusColors[interview.status] || "black";

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    company: interview.company,
    role: interview.role,
    status: interview.status,
  });

 const handleSchedule = (interview) => {
  const title = `Interview with ${interview.company}`;
  const details = `Role: ${interview.role}`;

  let dates = "";

  if (scheduleDate && scheduleTime) {
    const start = new Date(`${scheduleDate}T${scheduleTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); 

    const format = (date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    dates = `&dates=${format(start)}/${format(end)}`;
  }

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(details)}${dates}`;

  window.open(url, "_blank");
};
const [scheduleDate, setScheduleDate] = useState("");
const [scheduleTime, setScheduleTime] = useState("");
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md mb-4 transition-all duration-200 hover:shadow-lg hover:bg-slate-700/60 hover:-translate-y-0.5">
      {isEditing ? (
        <>
          <input placeholder="Company..." className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={editData.company}
            onChange={(e) =>
              setEditData({
                ...editData,
                company: e.target.value,
              })
            }
          />

          <input placeholder="Role..." className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={editData.role}
            onChange={(e) =>
              setEditData({
                ...editData,
                role: e.target.value,
              })
            }
          />

          <select  className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editData.status}
            onChange={(e) =>
              setEditData({
                ...editData,
                status: e.target.value,
              })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button  className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-500 transition text-sm"
            onClick={() => {
              handleUpdate(interview.id, editData);
              setIsEditing(false);
            }}
          >
            Save
          </button>

          <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-600 transition text-sm">
            Cancel
          </button>
        </>
      ) : (
        //left side
        <div className="flex items-center justify-between">
              <div>
    <h3 className="text-2xl font-semibold tracking-tight">
      {interview.company}
    </h3>

    <div className="flex items-center gap-2 mt-1">
      <p className="text-slate-400 text-sm leading-none">
        {interview.role}
      </p>

      <span
        className={`text-xs px-2 py-0.5 rounded-md opacity-80 ${statusColor}`}
      >
        {interview.status}
      </span>
    </div>
    {interview.status === "Applied" && (
  <div className="flex gap-2 mt-2">
    <input
      type="date"
      value={scheduleDate}
      onChange={(e) => setScheduleDate(e.target.value)}
      className="bg-slate-800 text-slate-100 px-2 py-1 rounded border border-slate-700"
    />

    <input
      type="time"
      value={scheduleTime}
      onChange={(e) => setScheduleTime(e.target.value)}
      className="bg-slate-800 text-slate-100 px-2 py-1 rounded border border-slate-700"
    />
  </div>
)}
  </div>
              {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
  
  <button
    onClick={() => handleToggleFavorite(interview.id)}
    className={`text-lg transition ${
  interview.isFavorite
    ? "text-blue-400"
    : "text-slate-500 hover:text-slate-300"
}`}
  >
    {interview.isFavorite ? "★" : "☆"}
  </button>

  <div className="flex gap-2">
    <button
      onClick={() => handleDelete(interview.id)}
      className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 active:scale-95"
    >
      Delete
    </button>

    <button
      onClick={() => setIsEditing(true)}
      className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded hover:bg-slate-600 active:scale-95"
    >
      Edit
    </button>
<button
  onClick={() => handleSchedule(interview)}
  disabled={interview.status !== "Applied"}
   title={
    interview.status !== "Applied"
      ? "Only available for applied interviews"
      : ""
  }
  className={`px-3 py-1 text-sm rounded transition ${
    interview.status === "Applied"
      ? "bg-green-900 text-white hover:bg-green-700"
      : "bg-slate-700 text-slate-400 cursor-not-allowed"
  }`}
>
  Schedule
</button>
  </div>

</div>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;