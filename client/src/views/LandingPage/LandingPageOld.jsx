/*!

=========================================================
* Material Kit React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import Header from "../../components/MaterialUI/Header/Header.jsx";
import Footer from "../../components/MaterialUI/Footer/Footer.jsx";
import GridContainer from "../../components/MaterialUI/Grid/GridContainer.jsx";
import GridItem from "../../components/MaterialUI/Grid/GridItem.jsx";
import Button from "../../components/MaterialUI/CustomButtons/Button.jsx";
import HeaderLinks from "../../components/MaterialUI/Header/HeaderLinks.jsx";
import Parallax from "../../components/MaterialUI/Parallax/Parallax.jsx";

import landingPageStyle from "../../assets/jss/material-kit-react/views/landingPage.jsx";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";
import logo from "../../assets/light.png";


import {
  NavbarToggler,
  NavbarBrand,
  NavLink
} from "reactstrap";



const dashboardRoutes = [];

class LandingPage extends React.Component {

  constructor() {
    super()
    this.myRef = React.createRef();
  }

  scroll(ref) {
    ref.current.scrollIntoView({behavior: 'smooth'})
  }


  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
{/*           <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="https://res.cloudinary.com/hwhpsei4r/image/upload/v1561874129/logo.png"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        /> */}
        
        <Parallax filter image={require("../../assets/img/landing-bg.jpg")}>
        {/* <NavLink><img src={logo} alt="Recal" width="100" /></NavLink> */}
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={9}>
                <h1 className={classes.title}>Meetings that don't suck</h1>
                <h4>
                  Some meetings should be emails. We help you make that happen.
                </h4>
                <br />
                 <Button onClick={() => {this.scroll(this.myRef)}}
                  color="danger"
                  size="lg"
                  // href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
                  // target="_blank"
                  // rel="noopener noreferrer"
                >
                  <i className="fas fa-play" />
                  Join our beta
                </Button> 
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <ProductSection />
            {/* <TeamSection /> */}
          </div>
          <p ref={this.myRef} className="scrollToHere"></p>
          <div>
            <WorkSection />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPageStyle)(LandingPage);
