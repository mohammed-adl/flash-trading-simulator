"use client";

import React, { use } from "react";

import Navbar from "./navbar/Navbar";
// import Dashboard from "./dashboard/Dashboard";

export default function NavBar({ params }) {
  const { username } = use(params);
  return (
    <>
      <Navbar username={username} />
      {/* <Dashboard className="w-4xl" /> */}
    </>
  );
}
