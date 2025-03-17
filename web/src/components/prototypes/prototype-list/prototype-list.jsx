import React, { useEffect, useState } from "react";
import { getPrototypes } from "../../../services/api-service";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function PrototypeList({ city, max }) {
  const [prototypes, setPrototypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPrototypes()
      .then((data) => {
        setPrototypes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Error loading prototypes");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading prototypes...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        {prototypes.slice(0, max).map((prototype) => (
          <Col md={4} key={prototype._id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={prototype.poster} />
              <Card.Body>
                <Card.Title>{prototype.title}</Card.Title>
                <Card.Text>{prototype.description}</Card.Text>
                {prototype._id && /^[a-zA-Z0-9\-]+$/.test(prototype._id) && (
                  <Link to={`/prototype/${encodeURIComponent(prototype._id)}`} className="btn btn-primary">
                  View Details
                  </Link>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PrototypeList;