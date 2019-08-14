import React, {
  Fragment,
  useState,
  useEffect 
} from "react";

import Columns from "../components/Columns/index";
import {
  useAuth0
} from "../../src/react-auth0-spa";

const Dashboard = () => {

  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const {
    getTokenSilently, user
  } = useAuth0();

  const loadUserData = (userToken) => {
      console.log("Dashboard loading...");
      getTokenSilently().then((token) => {

        console.log(`User Token - ${token}`);
        console.log(`Getting notes - ${token}`);

        fetch("/api/notes/get", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log('Obtained User Notes:' + data.length);
          setShowResult(true);
          setApiMessage(data);
        });     
      });  
  };

  useEffect(() => loadUserData(user.sub), []);
  
  return ( 
    <Fragment>
       {showResult && <div>{JSON.stringify(apiMessage, null, 2)}</div>}
      <Columns />
    </Fragment>
  )

}

export default Dashboard;