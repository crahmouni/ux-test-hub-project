import React, { useState, useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";

function TestimonialsSection() {
  const testimonials = [
    { author: "Sarah Chen", role: "UX Designer", text: "This platform revolutionized how we gather user feedback." },
    { author: "Mark Thompson", role: "Product Manager", text: "Data-driven decisions are now easier than ever!" },
    { author: "Lisa Rodriguez", role: "Design Lead", text: "The community feedback feature is a game-changer." },
  ];

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-4">What Our Users Say</h2>
        <Carousel prevLabel="Previous" nextLabel="Next" indicators className="testimonial-carousel">
        {testimonials.map((testimonial, index) => (
          <Carousel.Item key={index} className="text-center">
            <p className="lead">"{testimonial.text}"</p>
            <p className="fw-bold">{testimonial.author} - {testimonial.role}</p>
        </Carousel.Item>
        ))}
      </Carousel>

      </Container>
    </section>
  );
}

export default TestimonialsSection;
