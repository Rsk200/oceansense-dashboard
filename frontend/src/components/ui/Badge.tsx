import type { RiskLabel } from '../../types';

interface BadgeProps {
  variant: RiskLabel | 'default';
  children: React.ReactNode;
  className?: string;
}

const riskColors = {
  GREEN: 'bg-success/20 text-success border-success/30',
  YELLOW: 'bg-warning/20 text-warning border-warning/30',
  RED: 'bg-danger/20 text-danger border-danger/30',
  default: 'bg-accent/20 text-accent border-accent/30',
};

export const Badge = ({ variant, children, className = '' }: BadgeProps) => {
  const colorClass = riskColors[variant] || riskColors.default;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
