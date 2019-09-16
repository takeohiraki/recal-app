import React, {
  Fragment,
  useState,
  useEffect 
} from "react";

import Columns from "../components/Columns/index";
import NavBar from "../components/NavBar/NavBar";
import {
  useAuth0
} from "../../src/react-auth0-spa";

import GetNote from "../components/Notes/Notes";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes/test";

const Dashboardnew= () => {
  
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
  
  return (
  <Fragment>
    <Sidebar />
   
      <Columns notes={userNotes} events={userEvents} />

  </Fragment>
)};

export default Dashboardnew;