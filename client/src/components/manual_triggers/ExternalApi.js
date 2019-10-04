import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa.js";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      console.log('TOKEN: ' + token);
      const response = await fetch("/api/email/read", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();


      console.log(responseData)
      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={callApi}>Ping External API</button>
      
    </>
  );
};

export default ExternalApi;