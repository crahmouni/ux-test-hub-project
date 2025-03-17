import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../contexts/auth-context";

function AppNavbar() {
  const { user, logout } = useAuthContext();

  return (
    <Navbar expand="lg" bg="light" variant="light" fixed="top" className="shadow-sm border-bottom py-3">
      <Container>
      <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center">
        <div className="circle-outer me-2">
          <div className="circle-inner"></div>
        </div>
        UX Test Hub
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/ux-tests" className="mx-2">
              UX Tests
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="mx-2">
              Dashboard
            </Nav.Link>
           
          </Nav>

          {user ? (
            <div className="d-flex align-items-center ms-3">
              <Nav.Link as={Link} to="/profile" className="text-dark me-2">
                {user.email}
              </Nav.Link>
              <Button variant="outline-danger" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Button as={Link} to="/login" variant="outline-dark" className="me-2">
                Login
              </Button>
              <Button as={Link} to="/register" variant="primary">
                Sign Up
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
