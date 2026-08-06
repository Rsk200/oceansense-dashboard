import { motion } from 'framer-motion';
import { useFloodRisk } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RiskMapLeaflet from '../../components/common/RiskMapLeaflet';
import { MapPin, AlertTriangle, Droplets } from 'lucide-react';
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

  const getRiskIcon = (riskLabel: string) => {
    switch (riskLabel) {
      case 'RED': return AlertTriangle;
      case 'YELLOW': return AlertTriangle;
      default: return Droplets;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Risk Map</h1>
        <p className="text-white/70">Geographic view of flood risk across monitoring stations</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {floodRisk?.map((station) => {
          const RiskIcon = getRiskIcon(station.risk_label);
          
          return (
            <motion.div
              key={station.station_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-semibold text-white">{getStationName(station.station_id)}</h3>
                    </div>
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
                    <div className="flex justify-between">
                      <span className="text-white/60">Coordinates:</span>
                      <span className="text-white">
                        {station.lat.toFixed(4)}, {station.lon.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-2 text-xs">
                      <RiskIcon className={`w-4 h-4 ${
                        station.risk_label === 'RED' ? 'text-danger' : 
                        station.risk_label === 'YELLOW' ? 'text-warning' : 'text-success'
                      }`} />
                      <span className="text-white/70">{station.risk_description}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RiskMap;
