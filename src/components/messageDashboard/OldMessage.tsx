import React from "react";
import { Message } from "@/lib/types";

interface OldMessageProps {
  message: Message;
}

export default function OldMessage({ message }: OldMessageProps) {
  // Format dates for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "paused":
        return "bg-warning";
      case "sent":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <strong className="me-2">To: {message.recipient_email}</strong>
          <span
            className={`badge ${getStatusBadgeClass(
              message.status
            )} text-capitalize`}
          >
            {message.status}
          </span>
        </div>
        <small className="text-muted">
          Created: {formatDate(message.created_at)}
        </small>
      </div>

      <div className="card-body">
        {/* Message Content */}
        <div className="mb-3">
          <h6 className="card-subtitle mb-2 text-muted">Message:</h6>
          <p className="card-text">{message.message_content}</p>
        </div>

        {/* Message Details */}
        <div className="row">
          <div className="col-md-6">
            <small className="text-muted d-block">
              <strong>Deadman Duration:</strong> {message.deadman_duration} day
              {message.deadman_duration !== 1 ? "s" : ""}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
