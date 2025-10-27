"use client";
import React, { useState, useEffect } from "react";
import { Message } from "@/lib/types";
import { getMessages } from "@/lib/actions";
import { useAuth } from "@/context/auth";
import OldMessage from "./OldMessage";

interface MessageFeedProps {
  refreshTrigger?: number; // Prop to trigger refresh when messages are added
}

export default function MessageFeed({ refreshTrigger }: MessageFeedProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedMessages = await getMessages(user.uid);
      setMessages(fetchedMessages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts or user changes
  useEffect(() => {
    fetchMessages();
  }, [user]);

  // Refresh when refreshTrigger changes (new message added)
  useEffect(() => {
    if (refreshTrigger && user) {
      fetchMessages();
    }
  }, [refreshTrigger, user]);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h5 className="alert-heading">Error Loading Messages</h5>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={fetchMessages}>
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i className="bi bi-envelope-paper display-4 text-muted mb-3"></i>
          <h5 className="text-muted">No messages yet</h5>
          <p className="text-muted">
            Create your first failsafe message to get started.
          </p>
        </div>
      </div>
    );
  }

  // Messages list
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Your Messages ({messages.length})</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={fetchMessages}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {messages.map((message) => (
        <OldMessage key={message.id} message={message} />
      ))}
    </div>
  );
}
