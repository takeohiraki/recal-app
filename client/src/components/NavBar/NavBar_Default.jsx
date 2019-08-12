import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink as RouterNavLink } from "react-router-dom";
import logo from "../../assets/dark.png";

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


const NavBar_Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
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
              
            </Nav>
            <Nav className="d-none d-md-block" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    className="waves-effect waves-light btn"
                    onClick={() =>
                      loginWithRedirect({
                        access_type: "offline",
                        // Reminder: may need to add more scopes
                        // connection_scope: "https://www.googleapis.com/auth/calendar.events.readonly",
                        approval_prompt: "force"
                      })
                    }
                  >
                    Log in
                  </Button>
                </NavItem>
              
            </Nav>
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    className="waves-effect waves-light btn"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            
          </Collapse>
        </Container>
      </Navbar>
  )
}

export default NavBar_Default;