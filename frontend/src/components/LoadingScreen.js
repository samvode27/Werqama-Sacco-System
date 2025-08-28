import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingScreen = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f0f4ff, #d9e4ff)",
      }}
    >
      <Spinner animation="border" variant="primary" role="status" />
      <p className="mt-3 fw-semibold text-primary">Loading, please wait...</p>
    </div>
  );
};

export default LoadingScreen;
