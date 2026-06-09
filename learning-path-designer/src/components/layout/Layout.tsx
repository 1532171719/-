import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-page text-text-main">
      <Sidebar />
      <TopBar />
      <main className="ml-[220px] pt-[60px] min-h-screen">
        <div className="p-6 max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
