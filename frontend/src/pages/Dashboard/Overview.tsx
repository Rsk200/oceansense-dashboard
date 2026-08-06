import { motion } from 'framer-motion';
import { useFloodRisk, useAlerts, useAdvisory } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Waves, AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react';
import { getStationName } from '../../types';

const Overview = () => {
  const { data: floodRisk, isLoading: riskLoading } = useFloodRisk();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: advisories, isLoading: advisoriesLoading } = useAdvisory();

  if (riskLoading || alertsLoading || advisoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeAlerts = alerts?.filter(a => a.risk_label === 'RED')?.length || 0;
  const highRiskStations = floodRisk?.filter(s => s.risk_label === 'RED')?.length || 0;
  const latestForecast = floodRisk?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-white/70">Real-time flood risk monitoring and forecasts</p>
        </div>
        <div className="text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Waves}
          title="Current ENSO"
          value={latestForecast?.latest_month || 'N/A'}
          color="from-blue-500 to-cyan-500"
        />
        <SummaryCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={activeAlerts.toString()}
          color="from-red-500 to-orange-500"
        />
        <SummaryCard
          icon={MapPin}
          title="High Risk Stations"
          value={highRiskStations.toString()}
          color="from-yellow-500 to-orange-500"
        />
        <SummaryCard
          icon={TrendingUp}
          title="Forecast Horizon"
          value="12 Months"
          color="from-green-500 to-emerald-500"
        />
      </div>

      {/* Station Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Station Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {floodRisk?.map((station) => (
              <motion.div
                key={station.station_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{getStationName(station.station_id)}</h3>
                  <Badge variant={station.risk_label}>{station.risk_label}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Latest Month:</span>
                    <span className="text-white">{station.latest_month || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Water Level:</span>
                    <span className="text-white">{station.predicted_water_level_m?.toFixed(2) || 'N/A'}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Threshold:</span>
                    <span className="text-white">{station.flood_threshold_m.toFixed(2)}m</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      {alerts && alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <motion.div
                  key={`${alert.station_id}-${alert.target_month}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-white font-medium">{getStationName(alert.station_id)}</div>
                      <div className="text-white/60 text-sm">{alert.target_month}</div>
                    </div>
                  </div>
                  <Badge variant={alert.risk_label}>{alert.risk_label}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Advisory */}
      {advisories && advisories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Community Advisory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advisories.map((advisory) => (
                <motion.div
                  key={advisory.station_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{getStationName(advisory.station_id)}</h3>
                    <Badge variant={advisory.risk_label}>{advisory.risk_label}</Badge>
                  </div>
                  <h4 className="text-accent font-medium mb-2">{advisory.headline}</h4>
                  <p className="text-white/70 text-sm mb-3">{advisory.community_message}</p>
                  <div className="text-xs text-white/50">
                    <strong>Actions:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {advisory.actions.slice(0, 2).map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
}

const SummaryCard = ({ icon: Icon, title, value, color }: SummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 bg-gradient-to-r ${color} rounded-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          <div className="text-sm text-white/60">{title}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Overview;
