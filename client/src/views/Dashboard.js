<<<<<<< HEAD
import React, { Fragment } from "react";
=======
import React, {
  Fragment,
  useState,
  useEffect 
} from "react";

>>>>>>> 083271ee1c0e540378e341ce7c29080b4262692f
import Columns from "../components/Columns/index";
import {
  useAuth0
} from "../../src/react-auth0-spa";

<<<<<<< HEAD
const Dashboardnew= () => (
  <Fragment>
    <Columns />
  </Fragment>
)

export default Dashboardnew;
=======
const Dashboard = () => {

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
    <Fragment>
      <Columns notes={userNotes} events={userEvents} />
    </Fragment>
  )

}

export default Dashboard;
>>>>>>> 083271ee1c0e540378e341ce7c29080b4262692f
