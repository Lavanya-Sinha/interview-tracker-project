import { useEffect, useState } from "react";
import { getInterviews } from "../services/api";

const useAllInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchAll = async () => {
  try {
    setLoading(true);

    const data = await getInterviews(1, "", 1000);

    const interviewsData =
      data.interviews || data.data || data;

    setInterviews(interviewsData || []);
  } catch (err) {
    console.error("Error fetching all interviews", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAll();
  }, []);

  return { interviews, loading };
};

export default useAllInterviews;