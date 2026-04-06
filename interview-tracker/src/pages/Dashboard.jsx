import { useEffect, useState,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import InterviewCard from "../components/ui/InterviewCard";
import AddInteviewForm from "../components/ui/AddInterviewForm";
import Stats from "../components/ui/Stats";
import useInterviews from "../hooks/useInterviews";
import { useAuth } from "../hooks/useAuth";
import  useToast from "../hooks/useToast"

const Dashboard = () => {
const navigate = useNavigate()
 const {token} = useAuth()
useEffect(()=>{
  if(!token){
    navigate("/login")
  }
},[token])

const{logout} = useAuth()
const[page, setPage] = useState(1)
const [debouncedSearch, setDebouncedSearch] = useState("");
const{interviews,loading,error, addInterview, deleteInterview, updateInterview,total, refetch, toggleFavorite} = useInterviews(page,debouncedSearch)

const {showToast} = useToast()

//Websockets Frontend
useEffect(() => {
  const socket = new WebSocket("ws://127.0.0.1:8080");

  socket.onopen = () => {
    console.log("Frontend Socket Connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("WS event:", data);

      if (data.type === "INTERVIEW_ADDED" || data.type === "INTERVIEW_DELETED" || data.type === "INTERVIEW_UPDATED") {
        console.log("Interview change detected");
       refetch()
      }
    } catch {
      console.log("Non JSON data detected:", event.data);
    }
  };

  socket.onerror = (err) => {
    console.log("WS error:", err);
  };

  socket.onclose = () => {
    console.log("WS closed");
  };

  return () => {
    socket.close();
  };
}, [refetch]);

const handleDelete = (id) => {
deleteInterview(id)
showToast("Interview deleted");
}
const handleAddInterview = (newInterview) =>{
addInterview(newInterview)
showToast("Interview added");
}
const handleUpdate = (id, updatedData) => {
updateInterview(id,updatedData)
showToast("Interview updated");
};
const[searchTerm, setSearchTerm] = useState('')
useEffect(()=>{
  const timer = setTimeout(()=>{
 setDebouncedSearch(searchTerm);
  },1000)
  return ()=>clearTimeout(timer)
},[searchTerm])
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setPage(1);
}, [searchTerm]);
const[showFavorites, setShowFavorites] = useState(false)
const [statusFilter, setStatusFilter] = useState("All");
const filteredInterviews = useMemo(() => {
  if (!interviews) return [];

  return interviews
    .filter((interview) => {
      const matchedStatus =
        statusFilter === "All" || interview.status === statusFilter;

      const matchedFavorites =
        !showFavorites || interview.isFavorite;

      return matchedStatus && matchedFavorites;
    })
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
}, [interviews, statusFilter, showFavorites]);
if(loading){
  return <p>Loading Interviews... Please Wait...</p>
}
if(error){
return <p>{error}</p>
}
const totalPages = Math.ceil(total / 5);
  return (
  <Layout>
    <h2 className="text-lg font-semibold mb-3">Dashboard</h2>
    <div className="flex gap-2 mb-6">
     <input className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => {
        const value = e.target.value;
        setSearchTerm(value);
      }}
    />

    <select  className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All">All</option>
      <option value="Applied">Applied</option>
      <option value="Offer">Offer</option>
      <option value="Rejected">Rejected</option>
    </select>
    <button
  onClick={() => setShowFavorites(prev => !prev)}
  className={`px-3 py-2 rounded-md text-sm border ${
    showFavorites
      ? "bg-blue-600 text-white border-blue-600"
      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
  }`}
>
  {showFavorites ? "Favorites" : "All Interviews"}
</button>
    </div>

    <Stats interviews={interviews} />

    <AddInteviewForm onAddInterview={handleAddInterview} />

   {filteredInterviews.length === 0 ? (
  <div className="text-center text-slate-400 mt-10">
    
    {showFavorites ? (
      <p>No favorite interviews yet {''}
      <span className="text-blue-500">★</span>
      </p>
    ) : (
      <p>No interviews found. Start adding some!</p>
    )}

  </div>
) : (
  filteredInterviews.map((interview) => (
    <div key={interview.id}>
      <InterviewCard
        interview={interview}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleToggleFavorite={toggleFavorite}
      />
    </div>
  ))
)} 
      
   <div className="flex items-center justify-between mt-8">
  
  {/* LEFT: pagination */}
  <div className="flex items-center gap-3">
    
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      className="px-3 py-1 text-sm bg-slate-800 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-700 transition disabled:opacity-50"
    >
      Prev
    </button>

    <p className="text-sm text-slate-400">
      Page <span className="text-slate-200 font-medium">{page}</span>
    </p>

    <button
      disabled={page >= totalPages}
      onClick={() => setPage((prev) => prev + 1)}
      className="px-3 py-1 text-sm bg-slate-800 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-700 transition disabled:opacity-50"
    >
      Next
    </button>

  </div>

  <button
    onClick={logout}
    className="px-3 py-1 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition"
  >
    Log Out
  </button>

</div>
  </Layout>
);
};

export default Dashboard;