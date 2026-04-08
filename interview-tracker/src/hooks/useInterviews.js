import { useState, useEffect } from "react";
import { getInterviews, 
      deleteInterview as deleteInterviewAPI,
      addInterview as addInterviewAPI,
      updateInterview as updateInterviewAPI,
    } from "../services/api";

function useInterviews(page,search){
const [interviews, setInterviews] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const[total,setTotal] = useState(0)
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(()=>{
  setLoading(true)

  getInterviews(page,search)
    .then(response => {
  console.log("API data:", response);
  setInterviews(response.data);   
  setTotal(response.total);     
})
    .catch(err => {
      console.log(err)
      setError("Failed to load interviews")
    })
    .finally(() => {
      setLoading(false)
    })

}, [page,search])

const refetch = async () => {
  setLoading(true);

  try {
    const response = await getInterviews(page, search);
    setInterviews(response.data);
    setTotal(response.total);
  } catch (err) {
    console.log(err);
    setError("Failed to load interviews");
  } finally {
    setLoading(false);
  }
};

const deleteInterview = async (id) => {
  const previous = [...interviews]
setInterviews((prev) =>
  prev.filter((item) => item.id !== id)
);
  try {
    await deleteInterviewAPI(id);
  } catch (err) {
    console.log(err);
    setInterviews(previous); 
  }
};

const addInterview = async (newInterview) => {
  const TempInterview = {
  id: Date.now(),
  ...newInterview
};
  setInterviews((prev)=>[TempInterview,...prev])
  try {
    await addInterviewAPI(newInterview)
  } catch {
    setInterviews((prev) =>
  prev.filter((item) => item.id !== TempInterview.id)
);
  }

};

const updateInterview = async (id, updatedData) => {
  const previous = [...interviews]
  setInterviews((prev) =>
  prev.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item
  )
);
   try {
    await updateInterviewAPI(id, updatedData);
  } catch (err) {
    console.log(err);
    setInterviews(previous); 
  }

};

const toggleFavorite = (id) => {
  setInterviews(prev =>
    prev.map(i =>
      i.id === id
        ? { ...i, isFavorite: !i.isFavorite }
        : i
    )
  );
};

return {interviews, loading, error, addInterview, deleteInterview, updateInterview,total, refetch, toggleFavorite}
}


export default useInterviews