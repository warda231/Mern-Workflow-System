import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function CreateRequest(){
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");

    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e)=>{
      e.preventDefault();
      try {
        setLoading(true);
        await API.post("/requests",{
            title,
            description
        });
        toast.success("Request Created Successfully");
        setTitle("");
        setDescription("");
      } catch (error) {
        toast.error(
            error.response?.data?.message || "Something went wrong"
          );
    
      }finally {
        setLoading(false);
      }
    };  


    return (

        <div className="p-6 max-w-xl">
    
          <h1 className="text-2xl font-bold mb-4">
            Create Request
          </h1>
    
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
    
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded"
            />
    
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-3 rounded h-32"
            />
    
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create Request"}
            </button>
    
          </form>
    
        </div>
      );
}

export default CreateRequest;