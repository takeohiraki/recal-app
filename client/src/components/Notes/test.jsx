import React, {
  useState,
  useEffect 
} from "react";

import "./style.css";

import { MdSync } from "react-icons/md";
import Columns from "../Columns/indexnotab";
import {
  useAuth0
} from "../../../src/react-auth0-spa";

const Notes = () => {

  const [showResult, setShowResult] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [userEvents, setUserEvents] = useState("");


  const {
    getTokenSilently, user
  } = useAuth0();

  const loadUserData = (userToken) => {

    console.log("Dashboard loading...");
    const initGetUserData = async () => {

      let token = await getTokenSilently();
      console.log(`User Token - ${token.substring(0, 15) + '...'}`);

      /// NOTES /// 
      console.log(`Getting User Notes - ${token.substring(0, 15) + '...'}`);

      let notesDataResponse = await fetch("/api/notes/get", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let notesDataJson = await  notesDataResponse.json()
      console.log(`Obtained ${notesDataJson.length} User Notes`);

      setUserNotes(notesDataJson);

       /// EVENTS /// 
      console.log(`Getting User Events - ${token.substring(0, 15) + '...'}`);
      const eventsDataResponse = await fetch("/api/fetch_google_calendar_events", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let eventsDataJson = await  eventsDataResponse.json()
      console.log(`Obtained ${eventsDataJson.length} User Events`);

      setUserEvents(eventsDataJson);

      setShowResult(true);
     
    };

    initGetUserData();

  };

  useEffect(() => loadUserData(user.sub), []);
  
  //{showResult && <div>Notes: {JSON.stringify(userNotes, null, 2)}</div>}
  //{showResult && <div>Events: {JSON.stringify(userEvents, null, 2)}</div>}

  return ( 
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-6">
          <div className="card text-center notes-card notescardwidth">
            <div className="card-header">
              <span className="noteheader"><strong>Your Notes</strong></span>
              <a onClick={userNotes} className="btn-floating waves-effect waves-light refreshbtn"><MdSync /></a>
            </div>
          </div>
          <Columns notes={userNotes} events={userEvents} />
        </div>
        <div className="col-lg-6 col-md-6">
          <div className="card text-center notes-card calendarcardwidth">
            <div className="card-header">
              <span className="noteheader"><strong>Calendar</strong></span>
              <a onClick={userNotes} className="btn-floating waves-effect waves-light refreshbtn"><MdSync /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Notes;