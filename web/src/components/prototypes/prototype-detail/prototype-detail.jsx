import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPrototype } from "../../../services/api-service";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

function PrototypeDetail() {
  const { id } = useParams(); 
  console.log("🔍 ID recibido de useParams():", id);
  
  let decodedId = id;
  if (id && /%[0-9A-Fa-f]{2}/.test(id)) {
    try {
        decodedId = decodeURIComponent(id);
        console.log("✅ ID después de decodeURIComponent:", decodedId);
    } catch (error) {
        console.error("❌ Error al decodificar ID:", id, error);
        decodedId = id; 
    }
  }

  console.log("✅ ID después de decodeURIComponent:", decodedId);

  const [prototype, setPrototype] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decodedId) {
      setError("Invalid prototype ID");
      setLoading(false);
      return;
    }

    getPrototype(decodedId)
      .then((data) => {
        setPrototype(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Error fetching prototype details");
        setLoading(false);
      });
  }, [decodedId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading prototype details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/prototypes" className="btn btn-primary mt-3">
          Back to List
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            {prototype.poster && (
              <Card.Img variant="top" src={prototype.poster} alt={prototype.title} />
            )}
            <Card.Body>
              <Card.Title>{prototype.title}</Card.Title>
              <Card.Text>{prototype.description}</Card.Text>
              {prototype.startDate && (
                <p><strong>Start Date:</strong> {new Date(prototype.startDate).toLocaleDateString()}</p>
              )}
              {prototype.endDate && (
                <p><strong>End Date:</strong> {new Date(prototype.endDate).toLocaleDateString()}</p>
              )}
              <p><strong>Status:</strong> {prototype.status}</p>
              <p><strong>Feedback:</strong> {prototype.feedback || "No feedback yet"}</p>
              <Link to="/prototypes" className="btn btn-primary">
                Back to List
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PrototypeDetail;
