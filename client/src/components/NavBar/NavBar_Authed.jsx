import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink as RouterNavLink } from "react-router-dom";
import logo from "../../assets/dark.png";
import "./style.css";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { useAuth0 } from "../../react-auth0-spa";


const NavBar_Authed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });
    
  return (
<Navbar color="light" light expand="md">
        <Container>
          <NavbarBrand className="logo" />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/home"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  <img src={logo} alt="Recal" width="100" />
                </NavLink>
              </NavItem>


                <NavItem
                  className="greenbtnmargin"
                >
                  <NavLink
                    tag={RouterNavLink}
                    to="/external-api"
                    exact
                    activeClassName="router-link-exact-active"
                    id="qsLoginBtn"
                    className="waves-effect waves-light btn"
                  >
                    <p id="smallerfontgreenbtn">External API</p>
                  </NavLink>
                </NavItem>

                <NavItem
                  className="greenbtnmargin"
                >
                  <NavLink
                    tag={RouterNavLink}
                    to="/dashboard"
                    exact
                    activeClassName="router-link-exact-active"
                    id="qsLoginBtn"
                    className="waves-effect waves-light btn"
                  >
                    <p id="smallerfontgreenbtn">Dashboard</p>
                  </NavLink>
                </NavItem>
            </Nav>
            <Nav className="d-none d-md-block" navbar>
          
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={this.props.user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header><span id="username">{this.props.user.name}</span></DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /><span id="profilebtn"> Profile</span>
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /><span id ="logoutbtn"> Log
                      out</span> 
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={this.props.user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 
                      className="d-inline-block username"
                      style={{ textcolor: "rgb(253, 155, 91)" }}
                    >{this.props.user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Profile
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </NavItem>
              </Nav>
          </Collapse>
        </Container>
      </Navbar>
  )
}

export default NavBar_Authed;