import React, { Fragment } from "react";
import GetNote from "../components/Notes/Notes";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes/test";

const Dashboardnew= () => (
  <Fragment>
    <Sidebar />
    <div className="container">
    <Notes />
    </div>
  </Fragment>
);

export default Dashboardnew;