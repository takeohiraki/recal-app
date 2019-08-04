import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import contentData from "../../utils/contentData";
import ExternalApi from "../manual_triggers/ExternalApi.js";
import SeedCal from "../manual_triggers/SeedCal.js";
import SeedNotes from "../manual_triggers/SeedNotes.js";
import GetNotes from "../manual_triggers/GetNotes.js";
import AddNote from "../manual_triggers/AddNote.js";

import "./style.css";
import API from "../../utils/API";

class Content extends Component {
  seedGoogle = () => {
    API.seedGoogle()
      .then(res => console.log("seeded"))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="next-steps my-2">
        <ExternalApi />
        <SeedCal />
        <SeedNotes />
        <GetNotes />
        <AddNote />
        <h2 className="my-5 text-center">Welcome to Recal</h2>
        <Row className="d-flex justify-content-between">
          <div className="card text-center notes-card">
            <div className="card-header">
              {/* > notes/note-block */} Notes <p> Notes Example</p>
            </div>
          </div>

          <div className="card text-center event-project-card">
            <div className="card-header">
              {/* > google/calendar-block  */} Events / Project
            </div>
          </div>
        </Row>
      </div>
    );
  }
}

export default Content;
