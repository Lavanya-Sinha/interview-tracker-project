import { useState } from "react"

const AddInteviewForm = ({onAddInterview}) => {
    const [formData, setFormData] = useState({
          company: "",
    role: "",
    status: ""
    })
    const handleAddInterview = () => {
        if(!formData.company || !formData.role || !formData.status) return;
        const newInterview = {
            id :Date.now(),
             createdAt: Date.now(),
            company : formData.company,
            role : formData.role,
            status : formData.status,
            isFavourite : false,
        }
        onAddInterview(newInterview)

        setFormData({
            id : "",
            company : "",
            role : "",
            status : ""
        }) 
    }
    return(
  <div className="bg-slate-800 p-4 rounded-lg shadow-md mb-8">
    
    <div className="flex flex-col gap-3">

      <input
        className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Company"
        value={formData.company}
        onChange={(event) =>
          setFormData({
            ...formData,
            company: event.target.value,
          })
        }
      />

      <input
        className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Role"
        value={formData.role}
        onChange={(event) =>
          setFormData({
            ...formData,
            role: event.target.value,
          })
        }
      />

      <select
        className="bg-slate-800 text-slate-100 px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.status}
        onChange={(event) =>
          setFormData({
            ...formData,
            status: event.target.value,
          })
        }
      >
        <option value="">Select Status</option>
        <option value="Applied">Applied</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button
        onClick={handleAddInterview}
        className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-fit"
      >
        Add Interview
      </button>

    </div>

  </div>
);
}
export default AddInteviewForm