import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Trophy } from 'lucide-react';
import ArticleSection from '../components/article/ArticleSection';
import ArticleImage from '../components/article/ArticleImage';
import AnimatedGauge from '../components/article/AnimatedGauge';
import ReadingProgress from '../components/article/ReadingProgress';
import PullQuote from '../components/article/PullQuote';
import StickyScrollSection from '../components/article/StickyScrollSection';
import CountUpStat from '../components/article/CountUpStat';
import GlossaryTooltip from '../components/article/GlossaryTooltip';
import InteractiveEnsoMap from '../components/article/InteractiveEnsoMap';
import AnimatedDominoes from '../components/article/AnimatedDominoes';
import SystemDiagram from '../components/article/SystemDiagram';

const SECTIONS = [
  { id: 'why', label: 'Why' },
  { id: 'enso', label: 'ENSO' },
  { id: 'link', label: 'The Link' },
  { id: 'problem', label: 'The Gap' },
  { id: 'what', label: 'What Is It' },
  { id: 'data', label: 'The Data' },
  { id: 'pipeline', label: 'Data Pipeline' },
  { id: 'learn', label: 'How AI Learns' },
  { id: 'results', label: 'Results' },
  { id: 'forecast', label: '2026 Forecast' },
  { id: 'matters', label: 'Why It Matters' },
  { id: 'limits', label: 'Limits' },
  { id: 'next', label: "What's Next" },
  { id: 'stack', label: 'Tech Stack' },
];

export default function Article() {
  const [activeSection, setActiveSection] = useState('why');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-[#062a5a] text-white selection:bg-accent selection:text-primary pb-16 relative">
      <ReadingProgress />
      
      {/* Sticky CTA (Bottom Right) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-[60] hidden md:block"
      >
        <Link 
          to="/"
          className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-full font-bold font-mono text-xs uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all duration-300"
        >
          Launch Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Mobile Navigation (Top) */}
      <nav className="lg:hidden sticky top-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/10 overflow-x-auto shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex gap-5 py-4 px-6 whitespace-nowrap items-center">
          <Link to="/" className="font-mono text-[11px] uppercase tracking-widest text-white/60 pb-1 border-b-2 border-transparent flex items-center shrink-0">
            <ChevronLeft className="w-3 h-3 mr-1" /> Home
          </Link>
          <div className="w-px h-4 bg-white/20 shrink-0" />
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`font-mono text-[11px] uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 shrink-0 ${
                activeSection === section.id 
                  ? 'text-accent border-accent' 
                  : 'text-white/60 border-transparent'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-20 lg:pt-32 pb-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[10%] left-[20%] w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent blur-3xl" />
          <div className="absolute top-[20%] left-[80%] -translate-x-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-success/15 to-transparent blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-[11px] font-bold tracking-[0.2em] uppercase mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            OceanSense · Research Feature
          </motion.div>
          
          <motion.h1 
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8 tracking-tight text-white max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          >
            Can we see Bangladesh's next <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">big flood</span> — a year before it arrives?
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-16 leading-[1.75] font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          >
            Imagine getting a flood warning a full year in advance — not just a few days. That's the idea behind OceanSense: an AI system that connects ocean temperatures 8,000 km away in the Pacific to river levels in Kurigram, Gaibandha, and Jamalpur.
          </motion.p>

          <div className="max-w-2xl mx-auto mb-20 relative">
            <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
            <AnimatedGauge />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-dark rounded-2xl p-8 border border-white/5 hover:border-accent/30 transition-colors">
              <CountUpStat value={12} />
              <span className="text-sm text-white/60 leading-relaxed block">Months of forecast lead time — instead of days</span>
            </div>
            <div className="glass-dark rounded-2xl p-8 border border-white/5 hover:border-accent/30 transition-colors">
              <CountUpStat value={170} suffix="M" />
              <span className="text-sm text-white/60 leading-relaxed block">People living in Bangladesh's low-lying river delta</span>
            </div>
            <div className="glass-dark rounded-2xl p-8 border border-white/5 hover:border-accent/30 transition-colors">
              <CountUpStat value={18} suffix="M" />
              <span className="text-sm text-white/60 leading-relaxed block">People affected by flooding in 2024 alone</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
        
        {/* Desktop Sidebar TOC */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
          <Link to="/" className="font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-accent flex items-center mb-10 transition-colors">
            <ChevronLeft className="w-3 h-3 mr-1" /> Back to App
          </Link>
          <div className="font-mono text-xs font-bold text-white mb-6 tracking-widest uppercase">Contents</div>
          <nav className="flex flex-col gap-3 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`pl-5 text-sm transition-all duration-300 relative ${
                  activeSection === section.id 
                    ? 'text-accent font-medium' 
                    : 'text-white/50 hover:text-white/90'
                }`}
              >
                {activeSection === section.id && (
                  <motion.div 
                    layoutId="activeToc"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-accent shadow-[0_0_8px_rgba(0,194,255,0.8)]" 
                  />
                )}
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full lg:max-w-[720px] xl:max-w-[800px]">
          
          <ArticleSection variant="standard" id="why" index="01 — The Problem" title="Why does Bangladesh need a completely new kind of flood warning?">
            <p className="text-xl text-white/90">Picture a farmer in Kurigram, watching a rice field that isn't ready to harvest yet. Three enormous rivers — the Ganges, the Brahmaputra, and the Jamuna — all meet in Bangladesh, and more than <strong>170 million people</strong> live on land so flat that a single bad flood can wipe out a whole season's income overnight. In 2024 alone, flooding affected roughly 18 million people and caused over one billion US dollars in damage.</p>
            
            <PullQuote>
              It's a bit like finding out about an important exam the night before, instead of getting a whole semester to prepare for it.
            </PullQuote>

            <p>Today, most flood warnings arrive only a <strong>few days to a week</strong> before the water actually rises. That's enough time to move a bicycle or a cow to higher ground — but nowhere near enough time to plant a flood-resistant crop instead, or reinforce a mud embankment while the ground is still dry.</p>
            <p>OceanSense started with one simple question: <strong className="text-accent">what if the ocean itself could warn us, months in advance, that a flood is coming?</strong></p>
          </ArticleSection>

          <ArticleSection variant="standard" id="enso" index="02 — The Signal" title="What is ENSO, and why should a farmer in Kurigram care about the Pacific Ocean?">
            <p>Think of the tropical Pacific Ocean as a giant bathtub. Every two to seven years, the water in that bathtub swings between running a little warmer than usual (scientists call this <strong>El Niño</strong>) and a little cooler than usual (<strong>La Niña</strong>). This whole back-and-forth swing has a name: <GlossaryTooltip term="ENSO">ENSO</GlossaryTooltip>, short for the <strong>El Niño–Southern Oscillation</strong>.</p>
            <p>Here's why a farmer 8,000 km away should care: this ocean temperature swing doesn't stay in the water. Like a stone dropped into a pond sends ripples all the way to the far shore, a warmer or cooler Pacific sends ripples through wind patterns, air pressure, and rainfall all across the planet. Scientists call this a <GlossaryTooltip term="teleconnection">teleconnection</GlossaryTooltip>.</p>
            <div className="mt-12 mb-6">
              <InteractiveEnsoMap />
            </div>
          </ArticleSection>

          {/* Sticky Scrollytelling Section */}
          <StickyScrollSection
            id="link"
            index="03 — The Chain Reaction"
            title="How exactly does a warmer Pacific Ocean end up flooding a river 8,000 km away?"
            imageOnRight={true}
            image={<AnimatedDominoes />}
            content={
              <>
                <p>Think of it like four dominoes standing in a row, each one knocking over the next.</p>
                <ul className="space-y-6 mt-8 list-none pl-0">
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 1</strong> The Pacific Ocean's surface temperature shifts into an El Niño or La Niña state.</li>
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 2</strong> That shift changes the massive wind and pressure patterns blowing across Asia.</li>
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 3</strong> Those changed winds decide how much rain falls over the Himalayan foothills and the Brahmaputra basin during monsoon season.</li>
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 4</strong> That rainfall, combined with melting snow and water flowing in from upstream, dictates how high the rivers rise inside Bangladesh.</li>
                </ul>
                <p className="mt-8">This last domino is well documented. The severe 2017 Brahmaputra flood, for example, happened mainly because of an unusually high number of intense rainfall bursts feeding straight into the river system. But it isn't a perfectly predictable row of dominoes — sometimes one wobbles instead of falling cleanly. That's exactly why OceanSense can't just "predict the ocean" and call it done. It has to walk the entire chain.</p>
              </>
            }
          />

          <ArticleSection variant="standard" id="problem" index="04 — The Gap" title="If scientists already know ENSO affects Bangladesh, why isn't this solved already?">
            <p>Three gaps keep showing up, again and again, in the research.</p>
            <p><strong>Gap 1:</strong> Seasonal climate forecasts are often either not accurate enough, or don't give enough advance warning, for real disaster planning.</p>
            <p><strong>Gap 2:</strong> There's a missing translator between <em>global</em> ocean forecasts and <em>local</em> river conditions — almost nobody connects the two. It's a bit like having a weather report for the whole planet, but nothing that tells you whether to carry an umbrella on your own street.</p>
            <p><strong>Gap 3:</strong> Even when a solid forecast exists, there's rarely a simple system that turns it into a plain warning a community can actually act on.</p>
            <p>Older statistical methods are too rigid to capture how messy and unpredictable ocean-atmosphere behaviour really is. Modern forecasts hit a well-known wall called the <strong>Spring Predictability Barrier</strong> — think of it as a seasonal "fog" during which <GlossaryTooltip term="ENSO">ENSO</GlossaryTooltip> forecasts made in spring become far less trustworthy.</p>
          </ArticleSection>

          {/* Sticky Scrollytelling Section */}
          <StickyScrollSection
            id="what"
            index="05 — Meet the System"
            title="So, in plain terms — what actually is OceanSense?"
            imageOnRight={false}
            image={<SystemDiagram />}
            content={
              <>
                <p>In plain terms, OceanSense is three "helpers" working together like a relay race, where each runner hands the baton to the next:</p>
                <motion.ul 
                  className="space-y-8 mt-8 list-none pl-0"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.3 } }
                  }}
                >
                  <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pl-0">
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent font-mono text-xs font-bold rounded-full mb-3">Helper 1</span>
                    <strong className="block text-xl mb-2 font-display">Watches the ocean</strong>
                    <p className="text-base text-white/70">Looks at global sea surface temperature, wind, and pressure, and predicts what state ENSO will be in.</p>
                  </motion.li>
                  <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pl-0">
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent font-mono text-xs font-bold rounded-full mb-3">Helper 2</span>
                    <strong className="block text-xl mb-2 font-display">Listens to the rivers</strong>
                    <p className="text-base text-white/70">Takes local rainfall, soil moisture, and Helper 1's ENSO prediction, and estimates how high the water will get at specific river stations.</p>
                  </motion.li>
                  <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pl-0">
                    <span className="inline-block px-3 py-1 bg-danger/20 text-danger font-mono text-xs font-bold rounded-full mb-3">Helper 3</span>
                    <strong className="block text-xl mb-2 font-display">Connects the dots</strong>
                    <p className="text-base text-white/70">Runs the full relay: ENSO forecast → rainfall forecast → river-level forecast, looking as far as <strong>12 months</strong> ahead. The moment a station's predicted water level crosses <strong>22 metres</strong> (the <GlossaryTooltip term="BWDB">BWDB</GlossaryTooltip> danger line), the system raises a flood-risk flag.</p>
                  </motion.li>
                </motion.ul>
              </>
            }
          />

          <ArticleSection variant="glass-card" id="data" index="06 — The Raw Material" title="Where does OceanSense actually get its information?">
            <p>Any AI model is only as good as what you feed it. OceanSense uses two "ingredient baskets," both from public, trustworthy sources.</p>
            <p><strong>Basket 1 — the ocean's vital signs.</strong> Sea surface temperature, wind stress, air pressure, and ocean heat, pulled from the Copernicus Climate Data Store's ORAS5 ocean reanalysis and NOAA, with monthly records stretching from 2006 to 2025.</p>
            <p><strong>Basket 2 — the rivers' vital signs.</strong> River water level, rainfall, and soil moisture, collected from the <GlossaryTooltip term="BWDB">BWDB</GlossaryTooltip> and NASA POWER, for three flood-prone spots: <strong>Kurigram, Gaibandha, and Jamalpur</strong>.</p>
            
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-5 my-6 text-sm text-white/80">
              <strong className="text-warning block mb-1">Why only three stations?</strong> 
              Long, unbroken, twenty-year water-level records are surprisingly hard to find — much of the BWDB data had to be pulled together by hand, page by page. It's a real limitation, and the team is upfront about it.
            </div>
            
            <div className="mt-8 mb-4">
              <ArticleImage src="/article/4.png" alt="Map of Bangladesh showing the 3 river stations: Kurigram, Gaibandha, and Jamalpur" />
            </div>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="pipeline" index="07 — Data Pipeline" title="What happens to the data before the AI ever sees it?">
            <p>The raw numbers go through a rigorous pipeline. Time-series are aligned, variables are normalized, and <GlossaryTooltip term="PCA">PCA</GlossaryTooltip> is used to reduce the massive dimensionality of global climate maps down to just the critical patterns.</p>
            
            <div className="glass-dark border border-accent/30 rounded-2xl p-8 my-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="font-mono text-xl md:text-2xl text-accent font-bold mb-4 relative z-10">
                Rainfall Anomaly = (R - R<sub>mean</sub>) / R<sub>mean</sub> × 100
              </div>
              <p className="text-sm text-white/70 mb-0 relative z-10">This simple formula acts as a powerful amplifier for extreme weather signals.</p>
            </div>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="learn" index="08 — Inside the Machine" title="How does the AI actually learn to read the ocean?">
            <p>The team put five different "AI brains" through a head-to-head competition for ocean prediction, and ran a similar contest for river prediction. The clear winner was <GlossaryTooltip term="XGBoost">XGBoost</GlossaryTooltip>.</p>
            <p>Picture hundreds of tiny decision-makers, each one asking one simple question, like "was the temperature above 27°C?" Every decision-maker votes, and all the votes are combined into one final answer. It's especially strong at reading data that's already organized into neat rows and columns.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-black/20 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="text-accent font-mono font-bold mb-2 text-lg">MAE</div>
                <div className="text-xs text-white/60">On average, how far off was each guess. Like a golf score, lower is better.</div>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="text-accent font-mono font-bold mb-2 text-lg">RMSE</div>
                <div className="text-xs text-white/60">Punishes a really big miss extra hard. Lower is better.</div>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="text-accent font-mono font-bold mb-2 text-lg">R²</div>
                <div className="text-xs text-white/60">How much of the real-world pattern the model explains. 1.0 is a perfect score.</div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="results" index="09 — The Scorecard" title="Which model actually won — and why did some fail?">
            <p>For predicting the ocean's ENSO state, <strong>XGBoost won clearly</strong>, correctly explaining over 90% of what actually happened in the real world.</p>
            
            <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 font-mono text-white/50 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-6 py-5 font-medium">Model</th>
                    <th className="px-6 py-5 font-medium">MAE</th>
                    <th className="px-6 py-5 font-medium">RMSE</th>
                    <th className="px-6 py-5 font-medium">R²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr className="bg-accent/10 relative group transition-colors hover:bg-accent/20 cursor-default">
                    <td className="px-6 py-5 text-accent font-bold text-base flex items-center gap-2">
                      XGBoost 
                      <motion.div 
                        initial={{ scale: 0 }} 
                        whileInView={{ scale: 1 }} 
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <Trophy className="w-4 h-4 text-accent" />
                      </motion.div>
                    </td>
                    <td className="px-6 py-5 text-accent font-bold">0.354</td>
                    <td className="px-6 py-5 text-accent font-bold">0.486</td>
                    <td className="px-6 py-5 text-accent font-bold">0.906</td>
                    <td className="absolute inset-y-0 left-0 w-1 bg-accent shadow-[0_0_10px_#00c2ff]"></td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors cursor-default">
                    <td className="px-6 py-5 text-white/90">CNN-LSTM</td>
                    <td className="px-6 py-5 text-white/50">0.680</td>
                    <td className="px-6 py-5 text-white/50">0.972</td>
                    <td className="px-6 py-5 text-white/50">0.486</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors cursor-default">
                    <td className="px-6 py-5 text-white/90">CTEFNet</td>
                    <td className="px-6 py-5 text-white/50">0.792</td>
                    <td className="px-6 py-5 text-white/50">1.029</td>
                    <td className="px-6 py-5 text-white/50">0.447</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors cursor-default">
                    <td className="px-6 py-5 text-white/90">LSTM</td>
                    <td className="px-6 py-5 text-white/50">0.723</td>
                    <td className="px-6 py-5 text-white/50">0.939</td>
                    <td className="px-6 py-5 text-danger">-0.262</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p>An RMSE of 0.486 means XGBoost's guesses for the <GlossaryTooltip term="Niño 3.4 index">Niño 3.4 index</GlossaryTooltip> were typically off by less than half a degree Celsius. The standalone LSTM actually scored <em>below zero</em>, because a model with no built-in sense of "where" (geography) struggles with global climate.</p>
            <p>For local river water levels, a <strong>hybrid XGBoost–<GlossaryTooltip term="LSTM">LSTM</GlossaryTooltip> model</strong> pairing XGBoost's talent for tricky relationships with LSTM's talent for seasonal rhythm reached <strong>R² up to 0.923</strong>.</p>
          </ArticleSection>

          <ArticleSection variant="standard" id="forecast" index="10 — 2026 Forecast" title="What does OceanSense predict is coming in 2026?">
            <PullQuote>
              The model projects neutral ENSO conditions through the coming year.
            </PullQuote>
            <p>The Niño 3.4 index is expected to stay within the normal, calm range. In plain terms: no strong El Niño or La Niña is expected to stir up extreme weather.</p>
            <p>Following that signal all the way downstream, the pipeline forecasts that water levels at Kurigram, Gaibandha, and Jamalpur will <strong>stay below the 22-metre danger line throughout 2026</strong>. </p>
            <p>In short: <strong className="text-success">moderate flood risk, no extreme flooding expected</strong>.</p>
          </ArticleSection>
          
          <ArticleSection variant="standard" id="matters" index="11 — Why It Matters" title="Why does having twelve months of notice actually matter to real people?">
            <p>A week's warning lets you move your furniture to higher ground. A year's warning lets you change your decisions before they're locked in: choosing a flood-resistant seed variety before planting season, reinforcing an embankment while it's still dry season, or moving community resources into place before a crisis hits.</p>
            <p>At a policy level, this work is a direct contribution to <strong>UN Sustainable Development Goal 13 (Climate Action)</strong>.</p>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="limits" index="12 — Limits" title="What can't OceanSense do — at least, not yet?">
            <p>No forecasting system is a crystal ball.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">Depends on ENSO</div>
                <div className="text-sm text-white/60">If the starting ocean forecast is wrong, every prediction built on top of it inherits that mistake.</div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">Only 3 stations</div>
                <div className="text-sm text-white/60">They represent the wider basin well, but they aren't the whole country.</div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">No river physics</div>
                <div className="text-sm text-white/60">This is a pattern-recognition system, not a physical simulation of water flow.</div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">Data gaps</div>
                <div className="text-sm text-white/60">Public records sometimes have missing stretches, which can quietly bias the model.</div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection variant="standard" id="next" index="13 — What's Next" title="What's the plan for turning this into a real-world tool?">
            <p><strong>Phase 1</strong> is a web dashboard showing ENSO, rainfall, and water-level forecasts (which you are looking at now). <strong>Phase 2</strong> is a mobile app, built with Flutter, that works even offline and sends real-time flood alerts straight to someone's phone. <strong>Phase 3</strong> connects everything to live data feeds from NOAA, NASA, and BWDB so the whole pipeline updates itself automatically — turning it into a genuine <strong>Decision Support System</strong>.</p>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="stack" index="14 — Tech Stack" title="What was OceanSense actually built with?">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-4">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Languages</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>Python</span>
                  <span>TypeScript / React</span>
                  <span>SQL</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">ML Stack</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>XGBoost</span>
                  <span>PyTorch</span>
                  <span>TensorFlow</span>
                  <span>scikit-learn</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Data Processing</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>Pandas / NumPy</span>
                  <span>GeoPandas</span>
                  <span>Xarray</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Infrastructure</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>PostgreSQL</span>
                  <span>Docker</span>
                  <span>FastAPI</span>
                </div>
              </div>
            </div>
          </ArticleSection>

          {/* Footer */}
          <footer className="mt-24 pt-16 border-t border-white/10 pb-20">
            <div className="glass-dark border border-white/10 rounded-3xl p-10 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
              <h3 className="font-display font-bold text-2xl text-white mb-4 mt-0 relative z-10">About this research</h3>
              <p className="text-base text-white/70 leading-[1.75] mb-10 relative z-10">
                OceanSense: An AI-Powered ENSO Early Disaster Warning System is a CSE 4098B capstone project at the University of Liberal Arts Bangladesh (ULAB), Spring 2026, by <strong>Faria Islam Sara, Md Maruf Hossain, Rabbi Sadnan Khan,</strong> and <strong>Rakibul Hasan</strong>, under the supervision of <strong>Nasir Uddin Ahmed</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10 relative z-10">
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-3 font-bold">Fall '25</span>
                  <p className="text-sm text-white/60">Domain selection, problem framing, and literature review.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-3 font-bold">Spring '26</span>
                  <p className="text-sm text-white/60">Dataset collection, methodology design, and prototype.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-3 font-bold">Summer '26</span>
                  <p className="text-sm text-white/60">Core system build, testing, and final report writing.</p>
                </div>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
