import React from "react";

const Sidebar = () => (
  <div className="container">

        <ul id="slide-out" class="sidenav sidenav-fixed">
        <li><a href="#!">First Sidebar Link</a></li>
        <li><a href="#!">Second Sidebar Link</a></li>
      </ul>
      <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      </div>
    )
  
  
  export default Sidebar;