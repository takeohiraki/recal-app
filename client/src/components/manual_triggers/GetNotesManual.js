import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa.js";

const GetNotesManual = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      console.log('TOKEN: ' + token);
      const response = await fetch("/api/notes/get", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("ran GetNotes")
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
      <button onClick={callApi}>Get All Your Notes</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default GetNotesManual;
