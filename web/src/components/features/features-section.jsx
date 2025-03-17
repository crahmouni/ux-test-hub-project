import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaClipboardCheck, FaUsers, FaChartLine } from "react-icons/fa";

function FeaturesSection() {
  const features = [
    { icon: <FaClipboardCheck />, title: "Create Test Scenarios", text: "Easily define and execute UX test cases." },
    { icon: <FaUsers />, title: "Recruit Participants", text: "Find the right users for testing quickly." },
    { icon: <FaChartLine />, title: "Analyze Results", text: "Make data-driven decisions based on real insights." },
  ];

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-4">Why Choose UX Test Hub?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={4} key={index}>
              <Card className="text-center p-4 shadow-sm feature-card">
                <div className="display-4 text-primary mb-3">{feature.icon}</div>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text className="text-muted">{feature.text}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default FeaturesSection;
