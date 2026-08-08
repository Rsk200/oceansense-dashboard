import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ArticleSectionProps {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}

export default function ArticleSection({ id, index, title, children }: ArticleSectionProps) {
  return (
    <motion.section 
      id={id}
      className="py-14 border-b border-article-panel-line last:border-b-0 scroll-mt-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="font-mono text-article-teal text-[13px] tracking-widest mb-3 uppercase">
        {index}
      </div>
      
      <h2 className="font-article font-semibold text-[clamp(22px,3vw,29px)] leading-snug text-article-ivory mb-6 max-w-3xl">
        {title}
      </h2>
      
      <div className="text-article-ivory-dim text-[16.5px] leading-relaxed max-w-[680px] space-y-5 prose prose-invert prose-p:text-article-ivory-dim prose-strong:text-article-ivory prose-a:text-article-gold prose-a:underline prose-a:decoration-article-gold/40 hover:prose-a:decoration-article-gold">
        {children}
      </div>
    </motion.section>
  );
}
