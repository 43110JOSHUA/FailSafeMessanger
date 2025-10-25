"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-vh-100">
      <h1 className="text-center">Homepage</h1>
      <Link href="/dashboard">
        <button className="btn btn-primary">Go to Dashboard!</button>
      </Link>
    </div>
  );
}
