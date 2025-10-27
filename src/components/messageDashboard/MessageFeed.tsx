"use client";
import React, { useState, useEffect } from "react";
import { Message } from "@/lib/types";
import { getMessages } from "@/lib/actions";
import { useAuth } from "@/context/auth";
import OldMessage from "./OldMessage";

export default function MessageFeed() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user) {
      getMessages(user.uid).then(setMessages);
    }
  }, [user]);

  if (user && messages.length > 0) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Your Messages ({messages.length})</h5>
        </div>

        {messages.map((message) => (
          <OldMessage key={message.id} message={message} />
        ))}
      </div>
    );
  } else {
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
}
