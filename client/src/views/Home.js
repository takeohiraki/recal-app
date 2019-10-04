import React, { Fragment } from "react";
import HomePage from "../components/HomePage";
import NavBar from "../components/NavBar/NavBar";

const Home = () => (
  <Fragment>
    <NavBar />
    <div class="container greybackground">
    <HomePage />
    </div>
  </Fragment>
);

export default Home;
