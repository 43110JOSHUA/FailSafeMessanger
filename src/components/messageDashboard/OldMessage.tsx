"use client";

import React from "react";
import { Message, User } from "@/lib/types";
import { deleteMessage } from "@/lib/actions";

interface OldMessageProps {
  message: Message;
  user: User;
}

export default function OldMessage({ message, user }: OldMessageProps) {
  async function handleDelete() {
    await deleteMessage(message.id);
    // Refresh message feed
    if ((window as any).refreshMessages) {
      (window as any).refreshMessages();
    }
  }

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

  // Calculate remaining time until message is sent
  const getRemainingTime = () => {
    const now = new Date();
    const lastCheckin = new Date(user.last_checkin);
    const deadmanDurationMs = message.deadman_duration * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    // Calculate when the message should be sent
    const sendTime = new Date(lastCheckin.getTime() + deadmanDurationMs);

    // Calculate remaining time
    const remainingMs = sendTime.getTime() - now.getTime();

    if (remainingMs <= 0) {
      return { text: "Overdue", isOverdue: true };
    }

    // Convert back to days (with decimal places)
    const remainingDays = remainingMs / (24 * 60 * 60 * 1000);

    if (remainingDays < 1) {
      // Show hours if less than 1 day
      const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
      return {
        text: `${remainingHours} hour${
          remainingHours !== 1 ? "s" : ""
        } remaining`,
        isOverdue: false,
      };
    } else {
      // Show days
      const days = Math.floor(remainingDays);
      return {
        text: `${days} day${days !== 1 ? "s" : ""} remaining`,
        isOverdue: false,
      };
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
        <div className="d-flex mb-2 justify-content-between align-items-start">
          <div>
            <h6 className="card-subtitle text-muted fw-bold">Message:</h6>
          </div>
          <small className="card-subtitle text-muted">
            Deadman Duration: {message.deadman_duration} day
            {message.deadman_duration !== 1 ? "s" : ""}
          </small>
        </div>
        <p className="card-text px-2">{message.message_content}</p>

        {/* Remaining Time til send */}
        <div className="d-flex justify-content-between">
          <span
            className={`badge border ${
              getRemainingTime().isOverdue
                ? "bg-danger text-white"
                : "text-muted"
            }`}
          >
            <h6 className="pt-1">{getRemainingTime().text}</h6>
          </span>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
