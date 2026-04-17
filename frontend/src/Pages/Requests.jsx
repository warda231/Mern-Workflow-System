import { useEffect, useState } from "react";
import API from "../api/axios.js";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/requests");
      setRequests(res.data.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Requests</h2>

      {requests.map((req) => (
        <div key={req._id}>
          <h4>{req.title}</h4>
          <p>{req.description}</p>
          <p>Status: {req.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Requests;