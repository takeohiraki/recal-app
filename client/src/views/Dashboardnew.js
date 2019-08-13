import React, { Fragment } from "react";
import GetNote from "../components/Notes/Notes";
import Sidebar from "../components/Sidebar";
import App from "../components/Notes/test";

const Dashboardnew= () => (
  <Fragment>
    <GetNote />
   <App />
   <Sidebar />
  </Fragment>
);

export default Dashboardnew;