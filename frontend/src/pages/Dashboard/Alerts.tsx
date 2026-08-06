import { motion } from 'framer-motion';
import { useAlerts } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AlertTriangle, Activity, Clock, Filter } from 'lucide-react';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Alerts</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-danger/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-danger/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-danger" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{redAlerts.length}</div>
                    <div className="text-sm text-white/60">Critical Alerts</div>
                  </div>
                </div>
                <Badge variant="RED">RED</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-warning/20 rounded-lg">
                    <Activity className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{yellowAlerts.length}</div>
                    <div className="text-sm text-white/60">Warning Alerts</div>
                  </div>
                </div>
                <Badge variant="YELLOW">YELLOW</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Critical Alerts */}
      {redAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-danger" />
              <CardTitle>Critical Alerts - Immediate Action Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redAlerts.map((alert, index) => (
                <motion.div
                  key={`${alert.station_id}-${alert.target_month}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-danger/10 border border-danger/30 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-danger/20 rounded-lg mt-1">
                        <AlertTriangle className="w-5 h-5 text-danger" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{getStationName(alert.station_id)}</h3>
                          <Badge variant="RED">{alert.risk_label}</Badge>
                        </div>
                        <p className="text-white/70 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-2 text-sm text-white/50">
                          <Clock className="w-4 h-4" />
                          <span>Target: {alert.target_month}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Alerts */}
      {yellowAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-warning" />
              <CardTitle>Warning Alerts - Monitor Closely</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {yellowAlerts.map((alert, index) => (
                <motion.div
                  key={`${alert.station_id}-${alert.target_month}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-warning/10 border border-warning/30 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-warning/20 rounded-lg mt-1">
                        <Activity className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{getStationName(alert.station_id)}</h3>
                          <Badge variant="YELLOW">{alert.risk_label}</Badge>
                        </div>
                        <p className="text-white/70 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-2 text-sm text-white/50">
                          <Clock className="w-4 h-4" />
                          <span>Target: {alert.target_month}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
