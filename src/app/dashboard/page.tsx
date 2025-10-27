"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import NewMessage from "@/components/messageDashboard/NewMessage";
import MessageFeed from "@/components/messageDashboard/MessageFeed";
import LoginModal from "@/components/login/LoginModal";
import Logout from "@/components/login/Logout";

export default function Dashboard() {
  const { user } = useAuth();
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
                  <h6 className="mb-0">Welcome, {user?.displayName}</h6>
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

        {/* Messages Feed */}
        <div className="row">
          <div className="col">
            <MessageFeed/>
          </div>
        </div>

        {/* New Message Modal */}
        <NewMessage
          isOpen={showNewMessage}
          onClose={() => setShowNewMessage(false)}
          onMessageCreated={() => {
            // Trigger MessageFeed refresh when new message is created
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      </div>
    </div>
  );
}
