import { motion } from 'framer-motion';
import { useAdvisory } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle2, AlertTriangle, Info, ArrowRight, ShieldAlert, Activity, Clock, CheckCircle } from 'lucide-react';
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
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Community Advisory</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger text-xs font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-white/70">Actionable guidance for communities based on flood risk</p>
        </div>
      </div>

      {/* Advisory Summary KPIs (Moved to Top) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-success">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-black tracking-tight text-white">{sortedAdvisories.filter(a => a.risk_label === 'GREEN').length}</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-white/50 mt-1">Normal Monitoring</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`glass rounded-xl p-6 border relative overflow-hidden ${sortedAdvisories.filter(a => a.risk_label === 'YELLOW').length > 0 ? 'border-warning/30' : 'border-white/5'}`}
        >
          {sortedAdvisories.filter(a => a.risk_label === 'YELLOW').length > 0 && <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-warning" />}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl border ${sortedAdvisories.filter(a => a.risk_label === 'YELLOW').length > 0 ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-white/5 border-white/10 text-white/40'}`}>
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <div className={`text-3xl font-black tracking-tight ${sortedAdvisories.filter(a => a.risk_label === 'YELLOW').length > 0 ? 'text-white' : 'text-white/40'}`}>
                  {sortedAdvisories.filter(a => a.risk_label === 'YELLOW').length}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-white/50 mt-1">Prepare for Flooding</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`glass rounded-xl p-6 border relative overflow-hidden ${sortedAdvisories.filter(a => a.risk_label === 'RED').length > 0 ? 'border-danger/30' : 'border-white/5'}`}
        >
          {sortedAdvisories.filter(a => a.risk_label === 'RED').length > 0 && <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-danger" />}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl border ${sortedAdvisories.filter(a => a.risk_label === 'RED').length > 0 ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-white/5 border-white/10 text-white/40'}`}>
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className={`text-3xl font-black tracking-tight ${sortedAdvisories.filter(a => a.risk_label === 'RED').length > 0 ? 'text-white' : 'text-white/40'}`}>
                  {sortedAdvisories.filter(a => a.risk_label === 'RED').length}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-white/50 mt-1">Immediate Action</div>
              </div>
            </div>
          </div>
        </motion.div>
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
              <Card className={`h-full border-t-4 border-l-0 border-r-0 border-b-0 rounded-xl overflow-hidden glass ${
                  advisory.risk_label === 'RED' ? 'border-t-danger' : 
                  advisory.risk_label === 'YELLOW' ? 'border-t-warning' : 'border-t-success'
                }`}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl border ${
                        advisory.risk_label === 'RED' ? 'bg-danger/10 border-danger/20 text-danger' : 
                        advisory.risk_label === 'YELLOW' ? 'bg-warning/10 border-warning/20 text-warning' : 
                        'bg-success/10 border-success/20 text-success'
                      }`}>
                        <AdvisoryIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{getStationName(advisory.station_id)}</h3>
                      </div>
                    </div>
                    <Badge variant={advisory.risk_label}>{advisory.risk_label}</Badge>
                  </div>

                  {/* Headline */}
                  <div className="mb-6">
                    <h4 className={`text-xl font-black mb-3 leading-tight ${
                        advisory.risk_label === 'RED' ? 'text-danger' : 
                        advisory.risk_label === 'YELLOW' ? 'text-warning' : 'text-success'
                      }`}>
                      {advisory.headline}
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {advisory.community_message}
                    </p>
                  </div>

                  {/* Visual Progress Bar instead of plain text */}
                  {advisory.predicted_water_level_m !== null && (
                    <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between text-xs mb-2 font-mono">
                        <span className="text-white/50">Capacity vs Danger ({advisory.flood_threshold_m.toFixed(2)}m)</span>
                        <span className="text-white font-bold">{advisory.predicted_water_level_m.toFixed(2)}m</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (advisory.predicted_water_level_m / advisory.flood_threshold_m) * 100)}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            advisory.risk_label === 'RED' ? 'bg-danger shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 
                            advisory.risk_label === 'YELLOW' ? 'bg-warning' : 'bg-success'
                          }`} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Target Month */}
                  {advisory.target_month && (
                    <div className="mb-6 flex items-center space-x-2 text-xs font-mono font-medium uppercase tracking-wider text-white/40">
                      <Clock className="w-4 h-4" />
                      <span>Target: {new Date(advisory.target_month + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}

                  {/* Actions - Compact Modern Design */}
                  <div className="border-t border-white/5 pt-5">
                    <h5 className="text-white font-semibold mb-4 flex items-center text-sm uppercase tracking-wider">
                      <ArrowRight className="w-4 h-4 mr-2 text-white/40" />
                      Recommended Actions
                    </h5>
                    <ul className="space-y-3">
                      {advisory.actions.map((action, actionIndex) => (
                        <motion.li
                          key={actionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + actionIndex * 0.05 }}
                          className={`flex items-start space-x-3 text-sm p-3 rounded-lg border ${
                            advisory.risk_label === 'RED' ? 'bg-danger/5 border-danger/10 text-white/90' : 
                            advisory.risk_label === 'YELLOW' ? 'bg-warning/5 border-warning/10 text-white/90' : 
                            'bg-white/5 border-white/5 text-white/80'
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            advisory.risk_label === 'RED' ? 'text-danger' : 
                            advisory.risk_label === 'YELLOW' ? 'text-warning' : 'text-success'
                          }`} />
                          <span className="leading-relaxed">{action}</span>
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
    </motion.div>
  );
};

export default Advisory;
