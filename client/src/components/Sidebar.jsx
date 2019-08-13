import logo from "../assets/dark.png";
import { Link } from "react-router-dom";
import React from "react";

const Sidebar = () => (
  <div class="container">
    <ul id="slide-out" class="sidenav sidenav-fixed">
      <li>
        <div class="background">
          <Link to="/home"><img src={logo} alt="Recal" width="300" /></Link>
        </div>
      </li>
      <li class="greenbtnmargin">
        <Link to="/external-api" class="waves-effect waves-light btn">
          <p id="smallerfontgreenbtn">External API</p>
        </Link>
      </li>
      <li class="greenbtnmargin">
        <Link to="/dashboard" class="waves-effect waves-light btn">
          <p id="smallerfontgreenbtn">Dashboard</p>
        </Link>
      </li>
      <li>
        <div class="divider"></div>
      </li>
      <li>
        <a class="subheader">Subheader</a>
      </li>
    </ul>
  </div>
)
    
  export default Sidebar;