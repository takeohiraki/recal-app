import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Jumbotron, List, ListItem } from "bootstrap/dist/css/bootstrap.css";

import contentData from "../../utils/contentData";
import ExternalApi from "../manual_triggers/ExternalApi.js";
import SeedCal from "../manual_triggers/SeedCal.js";
import SeedNotes from "../manual_triggers/SeedNotes.js";
import GetNotes from "../manual_triggers/GetNotes.js";
import GetNotesManual from "../manual_triggers/GetNotesManual.js";
import AddNote from "../manual_triggers/AddNote.js";

import "./style.css";
import API from "../../utils/API";


class Content extends Component {
  /*   state = {
    notes: []
  }; */

  /*   componentDidMount() {
    this.getNotes();
  } */

  /*   getNotes = () => {
    API.getNotes()
      .then(res => this.setState({ notes: res.data }))
      .catch(err => console.log(err));
  }; */

  /*  seedGoogle = () => {
    API.seedGoogle()
      .then(res => console.log("seeded"))
      .catch(err => console.log(err));
  }; */

  render() {
    return (
      <div className="next-steps my-2">
        <ExternalApi />
        <SeedCal />
        <SeedNotes />
        <GetNotesManual />
        <AddNote />
        <h2 className="my-5 text-center">Recal</h2>
        <Row className="d-flex justify-content-between">
          <div className="card text-center notes-card">
            <div className="card-header">
              Notes 
            </div>
            <GetNotes />
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
