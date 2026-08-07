import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Waves,
  Droplets,
  Calculator,
  Map,
  AlertTriangle,
  MessageSquare,
  History,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/enso', icon: Waves, label: 'ENSO Forecast' },
    { path: '/dashboard/water-level', icon: Droplets, label: 'Water Level' },
    { path: '/dashboard/manual', icon: Calculator, label: 'Manual Prediction' },
    { path: '/dashboard/risk-map', icon: Map, label: 'Risk Map' },
    { path: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/dashboard/advisory', icon: MessageSquare, label: 'Advisory' },
    { path: '/dashboard/history', icon: History, label: 'Forecast History' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full glass-dark border-r border-white/10 z-50 w-64 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-2 group">
              <Waves className="w-6 h-6 text-accent drop-shadow-[0_0_8px_rgba(0,194,255,0.5)] transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-accent transition-colors">OceanSense</span>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-white/50 text-center">
              AI-Powered Flood Early Warning
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
