import React, { useState, useEffect } from "react";
import { Container, Carousel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import externalApi from "../services/external-api";
import { getPrototypes } from "../services/api-service";
import FeaturedCapturesCarousel from "../components/dashboard/featured-captures-carousel";

import HowItWorksSection from "../components/how-it-works-section/how-it-works-section";
import FeaturesSection from "../components/features/features-section";
import TestimonialsSection from "../components/testimonials/testimonials-section";
import CommunitySection from "../components/community/community-section";

function HomePage() {
  const [featuredPrototypes, setFeaturedPrototypes] = useState([]);
  const [screenshotUrl, setScreenshotUrl] = useState(null);

  useEffect(() => {
    const fetchPrototypes = async () => {
      try {
        const prototypesData = await getPrototypes();
        setFeaturedPrototypes(prototypesData);
      } catch (error) {
        console.error("Error al cargar los prototipos:", error);
      }
    };

    fetchPrototypes();
  }, []);

  useEffect(() => {
    const apiKey = "3186ff"; 
    const targetUrl = window.location.href;

    externalApi
      .get(
        `https://api.screenshotmachine.com?key=${apiKey}&url=${encodeURIComponent(
          targetUrl
        )}&dimension=1024x768`,
        { responseType: "blob" }
      )
      .then((response) => {
        console.log("Screenshot response:", response);
        const imageUrl = URL.createObjectURL(response.data);
        setScreenshotUrl(imageUrl);
      })
      .catch((error) => {
        console.error("Error al capturar la pantalla", error);
      });
  }, []);

  return (
    <main className="pt-[72px]">
      <HowItWorksSection />
      <FeaturesSection />
      <Container className="py-4">
        <h2>Featured Prototypes</h2>
        <FeaturedCapturesCarousel />
      </Container>
      <TestimonialsSection />
      <CommunitySection />
    </main>
  );
}

export default HomePage;
