import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { OfflineBanner } from '../ui/OfflineBanner';

export const BaseLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <OfflineBanner />
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <Footer />
      {/* Toasts removed: notifications disabled */}
    </div>
  );
};
