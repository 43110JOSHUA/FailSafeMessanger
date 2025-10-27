"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/auth";
import { addMessage } from "@/lib/actions";

interface NewMessageProps {
  isOpen: boolean;
  onClose?: () => void;
  onMessageCreated?: () => void; // Callback to refresh message list
}

export default function NewMessage({
  isOpen,
  onClose,
  onMessageCreated,
}: NewMessageProps) {
  const { user } = useAuth();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [deadmanDuration, setDeadmanDuration] = useState("60"); // days

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user) {
      return;
    }

    try {
      await addMessage(user?.uid, {
        recipientEmail,
        messageContent,
        deadmanDuration: parseInt(deadmanDuration),
      });

      // Reset form
      setRecipientEmail("");
      setMessageContent("");
      setDeadmanDuration("60");

      // Call callbacks
      if (onMessageCreated) {
        onMessageCreated();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error creating message:", error);
      alert("Failed to create message. Please try again.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Failsafe Message</h5>
            {onClose && (
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            )}
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Recipient Email */}
              <div className="row mb-3">
                <div className="col-md-8">
                  <label htmlFor="recipientEmail" className="form-label">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    id="recipientEmail"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="deadmanDuration" className="form-label">
                    Send After (Days)
                  </label>
                  <select
                    id="deadmanDuration"
                    value={deadmanDuration}
                    onChange={(e) => setDeadmanDuration(e.target.value)}
                    className="form-select"
                  >
                    <option value="1">1 Day</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                    <option value="180">180 Days</option>
                    <option value="365">1 Year</option>
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div className="mb-3">
                <label htmlFor="messageContent" className="form-label">
                  Failsafe Message
                </label>
                <textarea
                  id="messageContent"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Write your failsafe message here..."
                  rows={4}
                  className="form-control"
                  required
                />
              </div>
            </form>
          </div>

          <div className="modal-footer">
            {onClose && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
