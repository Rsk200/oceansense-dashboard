import { motion } from 'framer-motion';
import { useFloodRisk } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RiskMapLeaflet from '../../components/common/RiskMapLeaflet';
import { AlertTriangle, Droplets, TrendingUp } from 'lucide-react';
import { getStationName } from '../../types';

const RiskMap = () => {
  const { data: floodRisk, isLoading } = useFloodRisk();

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
            <h1 className="text-3xl font-bold text-white">Risk Map</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger text-xs font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-white/70">Geographic view of flood risk across monitoring stations</p>
        </div>
      </div>

      {/* Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Bangladesh Flood Risk Map</CardTitle>
        </CardHeader>
        <CardContent>
          {floodRisk && floodRisk.length > 0 ? (
            <RiskMapLeaflet stations={floodRisk} />
          ) : (
            <div className="w-full h-96 flex items-center justify-center glass rounded-lg">
              <p className="text-white/50">No station data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Station Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {floodRisk?.map((station) => {
          const percentage = Math.min(100, Math.max(0, ((station.predicted_water_level_m ?? 0) / station.flood_threshold_m) * 100));
          
          const RiskIcon =
            station.risk_label === 'RED'
              ? AlertTriangle
              : station.risk_label === 'YELLOW'
                ? TrendingUp
                : Droplets;
                
          const riskColor =
            station.risk_label === 'RED'
              ? 'text-danger'
              : station.risk_label === 'YELLOW'
                ? 'text-warning'
                : 'text-success';

          return (
            <motion.div
              key={station.station_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden"
            >
              <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-20 ${station.risk_label === 'RED' ? 'bg-danger' : station.risk_label === 'YELLOW' ? 'bg-warning' : 'bg-success'}`} />
              
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${riskColor}`}>
                    <RiskIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{getStationName(station.station_id)}</h3>
                </div>
                <Badge variant={station.risk_label}>{station.risk_label}</Badge>
              </div>

              <div className="space-y-4 text-sm relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[11px] uppercase font-mono tracking-wider text-white/50 block mb-1">Latest Month</span>
                    <span className="text-white font-medium">{new Date((station.latest_month || '2026-06') + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase font-mono tracking-wider text-white/50 block mb-1">Water Level</span>
                    <span className="text-white font-bold text-xl">{station.predicted_water_level_m?.toFixed(2) || 'N/A'}<span className="text-xs text-white/50 font-normal">m</span></span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2 font-mono">
                    <span className="text-white/50">Capacity vs Danger ({station.flood_threshold_m.toFixed(2)}m)</span>
                    <span className={percentage >= 100 ? 'text-danger font-bold' : percentage > 85 ? 'text-warning' : 'text-success'}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${percentage >= 100 ? 'bg-danger shadow-[0_0_12px_rgba(239,68,68,0.6)]' : percentage > 85 ? 'bg-warning' : 'bg-success'}`} 
                    />
                  </div>
                </div>
                
                {station.risk_description && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${riskColor}`} />
                      <p className={`text-xs leading-relaxed ${station.risk_label === 'RED' ? 'text-danger' : 'text-white/70'}`}>
                        {station.risk_description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RiskMap;
