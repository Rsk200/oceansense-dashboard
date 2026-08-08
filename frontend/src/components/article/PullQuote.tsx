import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PullQuoteProps {
  children: ReactNode;
}

export default function PullQuote({ children }: PullQuoteProps) {
  return (
    <motion.blockquote 
      className="my-12 pl-6 md:pl-8 border-l-4 border-accent relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute -left-6 top-0 text-6xl text-accent/20 font-display leading-none rotate-180">
        "
      </div>
      <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white leading-snug tracking-tight m-0">
        {children}
      </p>
    </motion.blockquote>
  );
}
