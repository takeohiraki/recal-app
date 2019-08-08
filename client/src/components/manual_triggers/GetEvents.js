import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa.js";

const GetEvents = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      console.log('TOKEN: ' + token);
      const response = await fetch("/api/fetch_google_calendar_events", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("ran GetGoogleEvents")
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
      <button onClick={callApi}>Get Events</button>

      {showResult && (
        <code>
          {Array.from(apiMessage).map(events => (
            <div className="card text-center" key={events.google_cal_event_id}>
              <div className="card-header">
                <p>{events.event_title}</p>
                <p>{events.event_start}</p>
              </div>
            </div>
          ))}
        </code>
      )}
    </>
  );
};

export default GetEvents;