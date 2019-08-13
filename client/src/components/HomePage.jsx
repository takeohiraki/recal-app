import React from "react";
import one from "../assets/1.png";
import two from "../assets/2.png";
import CarouselJumboTron from "../components/Carousel";

const HomePage = () => (
  <div className="container">
    <img className="responsive-img image1login" src={one} />
    <img className="responsive-img image2login" src={two} />
  </div>
);

export default HomePage;
