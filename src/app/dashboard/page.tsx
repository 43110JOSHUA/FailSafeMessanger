"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import NewMessage from "@/components/messageDashboard/NewMessage";
import LoginModal from "@/components/login/LoginModal";
import Logout from "@/components/login/Logout";

export default function Dashboard() {
  const { user } = useAuth();
  const [showNewMessage, setShowNewMessage] = useState(false);

  // User is authenticated - show dashboard
  return (
    <div className="min-vh-100">
      {!user && <LoginModal />}
      <div className="container py-4">
        {/* Dashboard Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="text-center mb-3">Personal Dashboard</h1>
            <Logout />
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
        
                <div>
                  <h6 className="mb-0">
                    Welcome, {user?.displayName}
                  </h6>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowNewMessage(true)}
              >
                New Message
              </button>
            </div>
          </div>
        </div>

        {/* Messages List - Placeholder */}
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-envelope-paper display-4 text-muted mb-3"></i>
                <h5 className="text-muted">No messages yet</h5>
                <p className="text-muted">
                  Create your first failsafe message to get started.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowNewMessage(true)}
                >
                  Create Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* New Message Modal */}
        <NewMessage
          isOpen={showNewMessage}
          onClose={() => setShowNewMessage(false)}
        />
      </div>
    </div>
  );
}
