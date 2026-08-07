import { motion } from 'framer-motion';
import { useAlerts } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AlertTriangle, Activity, Clock, Filter, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStationName } from '../../types';

const Alerts = () => {
  const { data: alerts, isLoading } = useAlerts();

  const sortedAlerts = alerts?.sort((a, b) => {
    const riskOrder = { 'RED': 0, 'YELLOW': 1 };
    return riskOrder[a.risk_label] - riskOrder[b.risk_label];
  }) || [];

  const redAlerts = sortedAlerts.filter(a => a.risk_label === 'RED');
  const yellowAlerts = sortedAlerts.filter(a => a.risk_label === 'YELLOW');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Active Alerts</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger text-xs font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-white/70">Real-time flood risk alerts for monitoring stations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-white/50" />
          <span className="text-white/50 text-sm">
            {sortedAlerts.length} total alerts
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`glass rounded-xl p-6 border relative overflow-hidden ${redAlerts.length > 0 ? 'border-danger/30' : 'border-white/5 opacity-70'}`}
        >
          {redAlerts.length > 0 && <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-20 bg-danger" />}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl border ${redAlerts.length > 0 ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-white/5 border-white/10 text-white/40'}`}>
                {redAlerts.length > 0 ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
              </div>
              <div>
                <div className={`text-4xl font-black tracking-tight ${redAlerts.length > 0 ? 'text-white' : 'text-white/40'}`}>{redAlerts.length}</div>
                <div className="text-sm uppercase tracking-wider font-semibold text-white/50 mt-1">Critical Alerts</div>
              </div>
            </div>
            {redAlerts.length > 0 && <Badge variant="RED">Immediate Action</Badge>}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`glass rounded-xl p-6 border relative overflow-hidden ${yellowAlerts.length > 0 ? 'border-warning/30' : 'border-white/5 opacity-70'}`}
        >
          {yellowAlerts.length > 0 && <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-20 bg-warning" />}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl border ${yellowAlerts.length > 0 ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-white/5 border-white/10 text-white/40'}`}>
                {yellowAlerts.length > 0 ? <TrendingUp className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
              </div>
              <div>
                <div className={`text-4xl font-black tracking-tight ${yellowAlerts.length > 0 ? 'text-white' : 'text-white/40'}`}>{yellowAlerts.length}</div>
                <div className="text-sm uppercase tracking-wider font-semibold text-white/50 mt-1">Warning Alerts</div>
              </div>
            </div>
            {yellowAlerts.length > 0 && <Badge variant="YELLOW">Monitor Closely</Badge>}
          </div>
        </motion.div>
      </div>

      {/* Critical Alerts */}
      {redAlerts.length > 0 && (
        <Card className="border-danger/30 bg-danger/5">
          <CardHeader className="border-b border-danger/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-danger animate-ping rounded-full opacity-50"></div>
                <AlertTriangle className="w-6 h-6 text-danger relative z-10" />
              </div>
              <CardTitle className="text-danger font-bold text-xl">Critical Alerts - Immediate Action Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {redAlerts.map((alert, index) => {
                const dateStr = new Date(alert.target_month + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' });
                const cleanMsg = alert.message
                  .replace(/^Station-[A-C]\s*/, '')
                  .replace(/\s*for\s*\d{4}-\d{2}$/, '');
                
                return (
                  <motion.div
                    key={`${alert.station_id}-${alert.target_month}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex bg-[#0A192F] border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-danger/50 transition-colors group"
                  >
                    <div className="w-2 bg-danger flex-shrink-0" />
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-white">{getStationName(alert.station_id)}</h3>
                          <Badge variant="RED">CRITICAL</Badge>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">{cleanMsg}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-2 text-xs font-mono text-danger font-medium uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Target: {dateStr}</span>
                        </div>
                        <Link to="/dashboard/water-level" className="text-xs text-white/50 hover:text-white flex items-center transition-colors">
                          View Chart <ChevronRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Alerts */}
      {yellowAlerts.length > 0 && (
        <Card className="border-warning/20">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-warning" />
              <CardTitle className="text-white font-bold text-xl">Warning Alerts - Monitor Closely</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {yellowAlerts.map((alert, index) => {
                const dateStr = new Date(alert.target_month + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' });
                const cleanMsg = alert.message
                  .replace(/^Station-[A-C]\s*/, '')
                  .replace(/\s*for\s*\d{4}-\d{2}$/, '');
                
                return (
                  <motion.div
                    key={`${alert.station_id}-${alert.target_month}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-1.5 bg-warning flex-shrink-0" />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-white">{getStationName(alert.station_id)}</h3>
                          <Badge variant="YELLOW">WARNING</Badge>
                        </div>
                        <p className="text-white/70 text-sm mb-3">{cleanMsg}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <div className="flex items-center space-x-2 text-xs font-mono text-warning/80 font-medium uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Target: {dateStr}</span>
                        </div>
                        <Link to="/dashboard/water-level" className="text-xs text-white/40 hover:text-white flex items-center transition-colors">
                          View Chart <ChevronRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Alerts State */}
      {sortedAlerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-success/20 rounded-full">
                <Activity className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-white">No Active Alerts</h3>
              <p className="text-white/70">All stations are currently within safe operating levels.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Alerts;
