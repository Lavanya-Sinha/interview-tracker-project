const BASE_URL =  import.meta.env.VITE_API_URL + "/interviews"
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
export const getInterviews = async (page = 1, search = "", limit = 5) => {
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("token");
    globalThis.location.href = "/login";
  }

  const data = await response.json();
  return data;
};
export const addInterview = async(newInterview)=>{
    const response = await fetch(`${BASE_URL}`,{
        method : "POST",
        headers : getAuthHeaders(),
        body : JSON.stringify(newInterview)
    })
      if (response.status === 401) {
     localStorage.removeItem("token");
     globalThis.location.href = "/login";
  }
    return response.json()
}
export const updateInterview = async (id,updatedData)=>{
    const response = await fetch(`${BASE_URL}/${id}`,
        {
            method : "PUT",
            headers : getAuthHeaders(),
            body : JSON.stringify(updatedData)
        }
    )
      if (response.status === 401) {
     localStorage.removeItem("token");
     globalThis.location.href = "/login";
  }
    return response.json()
}
export const deleteInterview =  async(id)=>{
    const response = await fetch(`${BASE_URL}/${id}`,{
        method : "DELETE",
        headers : getAuthHeaders()
    })
      if (response.status === 401) {
     localStorage.removeItem("token");
     globalThis.location.href = "/login";
  }
    return response.json()
}
export const loginUser = async(email,password)=>{
     const response = await fetch("https://interview-tracker-project.onrender.com/login",{
        method : "POST",
        headers : {
             "Content-Type" : "application/json"
        },
        body : JSON.stringify({email,password})
    })
    const data = await response.json();
    if(!response.ok){
       throw new Error(data.message)
    }
    return data
}

export const signupUser = async (email, password) => {
  const response = await fetch("https://interview-tracker-project.onrender.com/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
