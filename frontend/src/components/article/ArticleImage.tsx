import { motion } from 'framer-motion';

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <motion.figure 
      className="my-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative rounded-2xl overflow-hidden border border-article-panel-line/30 bg-article-navy-light shadow-2xl group">
        {/* Subtle glow effect behind the image */}
        <div className="absolute inset-0 bg-gradient-to-br from-article-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      
      {caption && (
        <figcaption className="mt-4 text-center text-sm font-mono text-article-ivory-dim tracking-wide px-4">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
