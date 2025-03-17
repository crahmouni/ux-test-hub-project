import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5"> 
      <Container>
        <Row>
          <Col md={3} className="mb-3 mb-md-0">
            <h5 className="fw-bold">UX Test Hub</h5>
            <p className="small">
              Simplifying UX testing for teams worldwide.
            </p>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h6>Company</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/about" className="text-white text-decoration-none"> 
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white text-decoration-none"> 
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-white text-decoration-none"> 
                  Press
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h6>Help</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/support" className="text-white text-decoration-none"> 
                  Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white text-decoration-none"> 
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-white text-decoration-none"> 
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Contact</h6>
            <p className="small text-white"> 
              info@uxtesthub.com
            </p>
            <p className="small text-white"> 
              +34 666666666
            </p>
          </Col>
        </Row>
        <hr className="border-top border-secondary my-3" />
        <div className="text-center small text-white"> 
          © {new Date().getFullYear()} UX Test Hub. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
