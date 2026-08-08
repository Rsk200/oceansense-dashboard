import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StickyScrollSectionProps {
  id: string;
  index: string;
  title: string;
  content: ReactNode;
  image: ReactNode;
  imageOnRight?: boolean;
}

export default function StickyScrollSection({ id, index, title, content, image, imageOnRight = true }: StickyScrollSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-24 relative">
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-accent text-xs font-bold tracking-[0.2em] uppercase shrink-0">
          {index}
        </span>
        <span className="h-px w-24 bg-gradient-to-r from-accent/50 to-transparent" />
      </div>
      
      <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-10 tracking-tight max-w-2xl">
        {title}
      </h2>

      <div className={`flex flex-col ${imageOnRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-start`}>
        {/* Text Column */}
        <div className="flex-1 min-w-0 prose prose-invert prose-lg prose-p:text-white/70 prose-headings:text-white prose-strong:text-white prose-a:text-accent hover:prose-a:text-accent-light prose-a:no-underline hover:prose-a:underline">
          {content}
        </div>

        {/* Sticky Image Column */}
        <div className="flex-1 min-w-0 w-full lg:sticky lg:top-32 relative group">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden glass border border-white/10 p-2 shadow-2xl relative"
          >
            {image}
          </motion.div>
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-accent/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-full" />
        </div>
      </div>
    </section>
  );
}
