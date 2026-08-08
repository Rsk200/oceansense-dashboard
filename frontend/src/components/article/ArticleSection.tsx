import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ArticleSectionProps {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  variant?: 'standard' | 'glass-card';
}

export default function ArticleSection({ id, index, title, children, variant = 'glass-card' }: ArticleSectionProps) {
  const isGlass = variant === 'glass-card';

  return (
    <motion.section 
      id={id}
      className={`scroll-mt-24 mb-16 relative ${isGlass ? 'group' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {isGlass && (
        <div className="absolute -left-3 top-6 bottom-6 w-1 bg-gradient-to-b from-accent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />
      )}

      <div className={isGlass ? "glass rounded-2xl p-6 md:p-8 lg:p-10 border border-white/10 hover:border-accent/30 transition-colors duration-500" : ""}>
        <div className="flex items-center gap-3 mb-6">
          <span className={isGlass ? "h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" : "h-px w-24 bg-gradient-to-r from-accent/50 to-transparent"} />
          <span className="font-mono text-accent text-xs font-bold tracking-[0.2em] uppercase shrink-0">
            {index}
          </span>
          {!isGlass && <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/50 opacity-0 md:opacity-100" />}
        </div>
        
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-8 tracking-tight">
          {title}
        </h2>
        
        <div className={`prose prose-invert prose-lg max-w-none prose-p:text-white/70 prose-headings:text-white prose-strong:text-white prose-a:text-accent hover:prose-a:text-accent-light prose-a:no-underline hover:prose-a:underline prose-li:text-white/70 ${!isGlass ? 'prose-p:leading-relaxed prose-p:text-lg md:prose-p:text-xl' : ''}`}>
          {children}
        </div>
      </div>
    </motion.section>
  );
}


