'use client';

import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';

export default function DashboardLayoutClient({ children, currentUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log("Trigger core auth integration sign-out logic.");
  };

  return (
    <div className="min-h-screen bg-[#050714] text-[#D1D5DB] antialiased flex relative overflow-hidden">
      
      {/* Mobile Drawer Backdrop Blur Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Fluid Responsive Sliding Drawer Sidebar Layout */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-[#0A0D22]
        md:translate-x-0 md:static md:block h-screen shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <DashboardSidebar 
          currentUser={currentUser} 
          closeSidebar={() => setIsSidebarOpen(false)} 
          onLogout={handleLogout}
        />
      </aside>

      {/* 2. Primary Workspace Matrix Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <DashboardNavbar 
          currentUser={currentUser} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#050714]">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}