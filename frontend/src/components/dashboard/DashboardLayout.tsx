import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Loader2 } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import Button from '../ui/Button';
import { useBootstrapForecast } from '../../hooks/queries';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isBootstrapping } = useBootstrapForecast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-[#062a5a]">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-16 left-4 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="md:ml-64 pt-16">
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
  );
};

export default DashboardLayout;
