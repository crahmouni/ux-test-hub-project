import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Upload Your Prototype",
      description:
        "Import your designs directly from Figma or upload images to start testing.",
    },
    {
      number: 2,
      title: "Get User Feedback",
      description:
        "Real users test your designs and provide detailed feedback on usability.",
    },
    {
      number: 3,
      title: "Analyze Results",
      description:
        "View comprehensive analytics and improve your designs with data-driven insights.",
    },
  ];

  return (
    <section className="bg-light py-5 mt-5">
      <Container>
        <h2 className="text-center fw-bold mb-4">How It Works</h2>
        <Row>
          {steps.map((step) => (
            <Col md={4} key={step.number}>
              <Card className="text-center p-4 shadow-sm how-it-works-card">
                <div className="display-4 text-primary mb-3">{step.number}</div>
                <Card.Title>{step.title}</Card.Title>
                <Card.Text className="text-muted">{step.description}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default HowItWorksSection;
