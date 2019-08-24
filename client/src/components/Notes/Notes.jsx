import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa.js";
import { MdSync } from "react-icons/md";
import "./style.css";

const GetNotes = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      console.log("TOKEN: " + token);
      const response = await fetch("/api/notes/get", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("ran GetNotes");
      const responseData = await response.json();

      console.log(responseData);

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="container">
      <div className="card text-center notes-card">
        <div className="card-header">
          <span className="noteheader"><strong>Your Notes</strong></span>
          <a onClick={callApi} className="btn-floating waves-effect waves-light refreshbtn"><MdSync /></a>
        </div>
        {showResult && (
        <code>
          {Array.from(apiMessage).map(notes => (
            <div className="card text-center" key={notes.id}>
              <div className="card-header">
                <p>{notes.note_text}</p>
              </div>
            </div>
          ))}
        </code>
      )}
      </div>
    
    </div>
  );
};

export default GetNotes;
