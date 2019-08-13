import React from "react";
import { Container, Row, Col } from "reactstrap";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import AgendaForm from "../components/AgendaForm";
import { useAuth0 } from "../react-auth0-spa";

const AgendaSubmission = () => {

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <AgendaForm />
      </Row>
    </Container>
  );
};

export default AgendaSubmission;
