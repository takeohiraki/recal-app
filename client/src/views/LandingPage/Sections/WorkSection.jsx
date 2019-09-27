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
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "../../../components/MaterialUI/Grid/GridContainer.jsx";
import GridItem from "../../../components/MaterialUI/Grid/GridItem.jsx";
// import CustomInput from "../../../components/MaterialUI/CustomInput/CustomInput.jsx";

// import { Input, TextArea, FormBtn } from "../../../components/MaterialUI/CustomInput/Form.js";
import CustomInput from "../../../components/MaterialUI/CustomInput/Form.js";
import CardBody from "../../../components/MaterialUI/Card/CardBody.jsx";
import Button from "../../../components/MaterialUI/CustomButtons/Button.jsx";

import workStyle from "../../../assets/jss/material-kit-react/views/landingPageSections/workStyle.jsx";

import API from "../../../utils/API";

import axios from "axios";

class WorkSection extends React.Component {
  state = {
    name: "",
    email: ""
  };

  handleInputChange = event => {
    console.log("handleInputChange");
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    console.log("value: " + value);
    console.log("name: " + [name]);
  };

  handleFormSubmit = event => {
    event.preventDefault();
    console.log("handleFormSubmit");
    console.log(this.state.name);
    console.log(this.state.email);
    if (this.state.name && this.state.email) {
      console.log("write");

      axios.post("/api/create-subscriber", {
        name: this.state.name,
        email: this.state.email
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });

    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem cs={12} sm={12} md={8}>
            <h2 className={classes.title}>Subscribe to join our Beta</h2>
            <h4 className={classes.description}>
              We're working hard to launch our product. Subscribe to be
              the first to try it out!
            </h4>
            <CardBody>
            <form>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    name={this.state.name}
                    onChange={this.handleInputChange}
                    name="name"
                    placeholder="Name"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    email={this.state.email}
                    onChange={this.handleInputChange}
                    name="email"
                    placeholder="Email"
                  />
                </GridItem>
                <GridContainer justify="center">
                  <GridItem
                    xs={12}
                    sm={12}
                    md={4}
                    className={classes.textCenter}
                  >
                    <Button color="primary" onClick={this.handleFormSubmit}>
                      Submit
                    </Button>
                  </GridItem>
                </GridContainer>
              </GridContainer>
            </form>
            </CardBody>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(workStyle)(WorkSection);