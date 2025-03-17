// src/components/dashboard/DashboardCaptures.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

const DashboardCaptures = () => {
  const [captures, setCaptures] = useState([]);
  const [selectedCapture, setSelectedCapture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/captures")
      .then((response) => {
        const sorted = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCaptures(sorted);
      })
      .catch((error) => {
        console.error("Error al cargar las capturas:", error);
      });
  }, []);

  const handleAnalyze = (capture) => {
    setSelectedCapture(capture);
    setComments([]); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCapture(null);
    setComment("");
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment = { text: comment, date: new Date() };
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <Container className="py-4 mt-5">
      <h2>All Captures</h2>
      {captures.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {captures.map((capture) => (
            <Col key={capture._id}>
              <Card className="h-100 capture-card">
                <Card.Img
                  variant="top"
                  src={capture.imageUrl || "https://placehold.co/600x400"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Text>
                    <strong>Created at:</strong>{" "}
                    {new Date(capture.createdAt).toLocaleString()}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleAnalyze(capture)}>
                    Analyze
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No captures found.</p>
      )}

      {selectedCapture && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Analyze Capture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedCapture.imageUrl || "https://placehold.co/800x600"}
              alt="Capture"
              style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
            />
            <p>
              <strong>Created at:</strong>{" "}
              {new Date(selectedCapture.createdAt).toLocaleString()}
            </p>

            {selectedCapture.originalUrl ? (
              <Button
                variant="secondary"
                href={selectedCapture.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Original
              </Button>
            ) : (
              <p>No original URL provided.</p>
            )}

            <hr />
            <h5>Share your feedback: What did you like or what could be improved?</h5>
            {comments.length > 0 ? (
              <ul>
                {comments.map((c, index) => (
                  <li key={index}>
                    {c.text} - {new Date(c.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
            <Form.Group controlId="comment">
              <Form.Label>Add a comment</Form.Label>
              <Form.Control
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your analysis..."
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddComment} className="mt-2">
              Add Comment
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default DashboardCaptures;
