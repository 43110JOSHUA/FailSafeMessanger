"use client";
import { useState } from "react";
import NewMessage from "../components/messageDashboard/NewMessage";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  function setToggle() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="min-vh-100">
      <h1 className="text-center">Personal Dashboard</h1>
      <NewMessage/>
    </div>
  );
}

