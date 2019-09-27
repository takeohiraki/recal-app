import logo from "../assets/dark.png";
import { Link } from "react-router-dom";
import React from "react";
import "./style.css";

const Sidebar = () => (
  <div className="container">
    <ul id="slide-out" className="sidenav sidenav-fixed">
      <li>
        <div className="background">
          <Link to="/home"><img src={logo} alt="Recal" width="300" /></Link>
        </div>
      </li>
      <li className="greenbtnmargin">
        <Link to="/external-api" className="waves-effect waves-light btn">
          <p id="smallerfontgreenbtn">External API</p>
        </Link>
      </li>
      <li className="greenbtnmargin">
        <Link to="/dashboard" className="waves-effect waves-light btn">
          <p id="smallerfontgreenbtn">Dashboard</p>
        </Link>
      </li>
      <li className="spacedivider">
        <div className="divider"></div>
      </li>
      <li className="greenbtnmargin">
        <Link to="#" className="waves-effect waves-light orange btn">
          <p id="smallerfontgreenbtn">Calendar</p>
        </Link>
      </li>
      <li className="greenbtnmargin">
        <Link to="#" className="waves-effect waves-light orange btn">
          <p id="smallerfontgreenbtn">Project</p>
        </Link>
      </li>
    </ul>
  </div>
)
    
  export default Sidebar;