import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa.js";


let exampleData = {
  note_text: "Note from add-note endpoint",
  note_type: "/Agenda",
  user_name: "add-note-user",
  user_id: "google-oauth2|114577142554347012839",
  slack_user_id: 123456
};
 
const AddNote = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  // pull data from auth0 user profile to insert into note
  const { user } = useAuth0()
  // user_id - google-oauth2|nnnnnnnnn
  console.log(user.sub)
  // user_name - Full Name
  console.log(user.name)

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      console.log("TOKEN: " + token);
      const response = await fetch("/api/notes/add-note", {
        method: "post",
        headers: {
          'Authorization': `Bearer ${token}`
          , 'Content-Type': 'application/json'
          , 'Accept': 'application/json',
        },
        body: JSON.stringify(exampleData)
      });

      console.log("ran AddNote");
      console.log(JSON.stringify(exampleData));

      const responseData = await response.json();

      console.log(responseData);

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={callApi}>Add note</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default AddNote;
