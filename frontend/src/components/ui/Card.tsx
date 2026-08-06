import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  return (
    <motion.div
      className={`glass panel-glow rounded-lg p-5 transition-all duration-200 ease-out ${
        hover ? 'hover:-translate-y-1 hover:border-sky-400/55 hover:bg-white/12 hover:shadow-[0_20px_70px_rgba(56,189,248,0.16)]' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={`text-xl font-semibold text-white ${className}`}>{children}</h3>;
};

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

export default Card;
