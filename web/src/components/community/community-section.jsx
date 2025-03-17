import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; 

function CommunitySection() {
  return (
    <section className="py-5 text-center">
      <Container>
        <h2 className="fw-bold">Join Our Growing Community</h2>
        <p className="text-muted">
          Connect with UX professionals, share insights, and improve your designs.
        </p>
        <Row className="justify-content-center">
          <Col md={3}>
            <h3 className="text-primary fw-bold">15,482</h3>
            <p>Tests Conducted</p>
          </Col>
          <Col md={3}>
            <h3 className="text-primary fw-bold">2,891</h3>
            <p>Active Users</p>
          </Col>
          <Col md={3}>
            <h3 className="text-primary fw-bold">42,067</h3>
            <p>Feedback Collected</p>
          </Col>
        </Row>
        <Button
          as={Link} 
          to="/register"
          variant="primary"
          className="mt-3"
        >
          Join Now
        </Button>
      </Container>
    </section>
  );
}

export default CommunitySection;