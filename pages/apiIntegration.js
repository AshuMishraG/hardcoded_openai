// Import necessary hooks and libraries
import { useEffect, useState } from "react";
import axios from "axios";

// Function to handle GET request
async function fetchData() {
  try {
    const response = await axios.get(
      "https://assistants.megaspace.ai/se/api/sample-get-response"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to handle POST request
async function postData() {
  try {
    const requestBody = {
      id: 1,
      name: "Test User",
    };

    const response = await axios.post(
      "https://assistants.megaspace.ai/se/api/sample-post-response",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

// React component to display API data
const APIIntegration = () => {
  const [getData, setGetData] = useState(null);
  const [postDataResponse, setPostDataResponse] = useState(null);

  // Fetch GET and POST data on component mount
  useEffect(() => {
    async function loadGetData() {
      const data = await fetchData();
      setGetData(data);
    }

    async function sendPostData() {
      const data = await postData();
      setPostDataResponse(data);
    }

    loadGetData();
    sendPostData();
  }, []);

  return (
    <div>
      <h1>GET API Response:</h1>
      <pre>{JSON.stringify(getData, null, 2)}</pre>

      <h1>POST API Response:</h1>
      <pre>{JSON.stringify(postDataResponse, null, 2)}</pre>
    </div>
  );
};

export default APIIntegration;
