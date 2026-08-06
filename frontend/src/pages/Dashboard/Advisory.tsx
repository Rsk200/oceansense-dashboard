import { motion } from 'framer-motion';
import { useAdvisory } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { getStationName } from '../../types';

const Advisory = () => {
  const { data: advisories, isLoading } = useAdvisory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sortedAdvisories = advisories?.sort((a, b) => {
    const riskOrder = { 'RED': 0, 'YELLOW': 1, 'GREEN': 2 };
    return riskOrder[a.risk_label] - riskOrder[b.risk_label];
  }) || [];

  const getAdvisoryIcon = (riskLabel: string) => {
    switch (riskLabel) {
      case 'RED': return AlertTriangle;
      case 'YELLOW': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getAdvisoryColor = (riskLabel: string) => {
    switch (riskLabel) {
      case 'RED': return 'text-danger bg-danger/20 border-danger/30';
      case 'YELLOW': return 'text-warning bg-warning/20 border-warning/30';
      default: return 'text-success bg-success/20 border-success/30';
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
        <h1 className="text-3xl font-bold text-white mb-2">Community Advisory</h1>
        <p className="text-white/70">Actionable guidance for communities based on flood risk</p>
      </div>

      {/* Advisory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sortedAdvisories.map((advisory, index) => {
          const AdvisoryIcon = getAdvisoryIcon(advisory.risk_label);
          const colorClass = getAdvisoryColor(advisory.risk_label);
          
          return (
            <motion.div
              key={advisory.station_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full border-2 ${colorClass.split(' ').slice(1).join(' ')}`}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${colorClass}`}>
                        <AdvisoryIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{getStationName(advisory.station_id)}</h3>
                        <Badge variant={advisory.risk_label}>
                          {advisory.risk_label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <div className="mb-4">
                    <h4 className={`text-xl font-bold ${colorClass.split(' ')[0]} mb-2`}>
                      {advisory.headline}
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {advisory.community_message}
                    </p>
                  </div>

                  {/* Water Level Info */}
                  {advisory.predicted_water_level_m !== null && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Predicted Level:</span>
                        <span className="text-white font-semibold">
                          {advisory.predicted_water_level_m.toFixed(2)}m
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-white/60">Danger Threshold:</span>
                        <span className="text-white font-semibold">
                          {advisory.flood_threshold_m.toFixed(2)}m
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Target Month */}
                  {advisory.target_month && (
                    <div className="mb-4 flex items-center space-x-2 text-sm text-white/50">
                      <Info className="w-4 h-4" />
                      <span>Forecast for: {advisory.target_month}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-white/10 pt-4">
                    <h5 className="text-white font-semibold mb-3 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2 text-accent" />
                      Recommended Actions
                    </h5>
                    <ul className="space-y-2">
                      {advisory.actions.map((action, actionIndex) => (
                        <motion.li
                          key={actionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + actionIndex * 0.05 }}
                          className="flex items-start space-x-2 text-sm text-white/80"
                        >
                          <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Advisory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-3xl font-bold text-success mb-2">
                {sortedAdvisories.filter(a => a.risk_label === 'GREEN').length}
              </div>
              <div className="text-white/60 text-sm">Normal Monitoring</div>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-3xl font-bold text-warning mb-2">
                {sortedAdvisories.filter(a => a.risk_label === 'YELLOW').length}
              </div>
              <div className="text-white/60 text-sm">Prepare for Flooding</div>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-3xl font-bold text-danger mb-2">
                {sortedAdvisories.filter(a => a.risk_label === 'RED').length}
              </div>
              <div className="text-white/60 text-sm">Immediate Action</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Advisory;
