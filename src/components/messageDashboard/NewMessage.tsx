"use client"; 
import React, { useState } from "react";

export default function NewMessage() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [deadmanDuration, setDeadmanDuration] = useState("60"); // days

  return (
    <div className="card my-4 mx-2 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Create New Failsafe Message</h5>
      </div>

      <div className="card-body">
        <form>
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

          {/* Action Buttons */}
          <div className="d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary">
              Create Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
