import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Loader2, Waves } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import Button from '../ui/Button';
import { useBootstrapForecast } from '../../hooks/queries';

import PageTransition from '../layout/PageTransition';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isBootstrapping } = useBootstrapForecast();

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-[#062a5a]">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-primary/80 backdrop-blur-xl z-40 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-1 -ml-2 text-white/70 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <Waves className="w-5 h-5 text-accent drop-shadow-[0_0_8px_rgba(0,194,255,0.5)]" />
            <span className="text-base font-bold text-white tracking-tight">OceanSense</span>
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="md:ml-64 pt-16 md:pt-4">
          {isBootstrapping && (
            <div className="mx-4 md:mx-8 mt-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running initial forecast to populate your dashboard…</span>
            </div>
          )}
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardLayout;
