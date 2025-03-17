import React from "react";
import { Container, Alert } from "react-bootstrap";


function ConfirmEmailPage() {
  return (
    <Container className="text-center mt-5">
      <Alert variant="success">
        <h4>Please check your email</h4>
        <p>We've sent a confirmation email to your address. Click the link in the email to activate your account.</p>
      </Alert>
    </Container>
  );
}

export default ConfirmEmailPage;