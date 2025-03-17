
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Carousel } from "react-bootstrap";

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
        setCaptures(sorted.slice(0, 3));
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
    <div>
      {captures.length > 0 ? (
        <Carousel>
          {captures.map((capture) => (
            <Carousel.Item key={capture._id}>
              <img
                className="d-block w-100"
                src={capture.imageUrl || "https://placehold.co/600x400"}
                alt="Capture"
                style={{ width: "600px", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <p>
                  Created at: {new Date(capture.createdAt).toLocaleString()}
                </p>
                <Button variant="primary" onClick={() => handleAnalyze(capture)}>
                  Analyze
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No captures found. Try uploading some!</p>
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
            <h5>Comments / Analysis</h5>
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
    </div>
  );
};

export default DashboardCaptures;
