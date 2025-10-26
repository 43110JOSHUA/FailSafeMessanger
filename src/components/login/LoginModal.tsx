"use client";
import React from "react";
import { useAuth } from "@/context/auth";

export default function LoginModal() {
  const auth = useAuth();

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 2000 }}
    >
      <div
        className="card p-4 shadow"
        style={{ minWidth: 320, maxWidth: 350 }}
      >
        <h5 className="mb-3 text-center">Login Required</h5>
        <p className="text-center text-muted mb-4">
          Please log in to access your dashboard.
        </p>
        <button
          className="btn btn-primary w-100"
          onClick={() => {
            auth?.loginWithGoogle();
          }}
        >
          <i className="bi bi-google me-2"></i>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
