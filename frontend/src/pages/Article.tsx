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
  { id: 'glossary', label: 'Glossary' },
];

export default function Article() {
  const [activeSection, setActiveSection] = useState('why');

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      let current = SECTIONS[0].id; // Default to first
      
      for (const el of sectionElements) {
        if (el) {
          // If the top of the section is above the middle of the screen (or top third)
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = el.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    return () => window.removeEventListener('scroll', handleScroll);
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
          
          <ArticleSection variant="standard" id="why" index="01 — The Problem, In Human Terms" title="Why does Bangladesh need a completely new kind of flood warning?">
            <p className="text-xl text-white/90">Picture a farmer in Kurigram, watching a rice field that isn't ready to harvest yet. Three enormous rivers — the Ganges, the Brahmaputra, and the Jamuna — all meet in Bangladesh, and more than <strong>170 million people</strong> live on land so flat that a single bad flood can wipe out a whole season's income overnight. In 2024 alone, flooding affected roughly 18 million people and caused over one billion US dollars in damage.</p>
            
            <PullQuote>
              It's a bit like finding out about an important exam the night before, instead of getting a whole semester to prepare for it.
            </PullQuote>

            <p>Today, most flood warnings arrive only a <strong>few days to a week</strong> before the water actually rises. That's enough time to move a bicycle or a cow to higher ground — but nowhere near enough time to plant a flood-resistant crop instead, or reinforce a mud embankment while the ground is still dry. It's a bit like finding out about an important exam the night before, instead of getting a whole semester to prepare for it.</p>
            <p>OceanSense started with one simple question: <strong className="text-accent">what if the ocean itself could warn us, months in advance, that a flood is coming?</strong></p>
          </ArticleSection>

          <ArticleSection variant="standard" id="enso" index="02 — The Ocean Signal" title="What is ENSO, and why should a farmer in Kurigram care about the Pacific Ocean?">
            <p>Think of the tropical Pacific Ocean as a giant bathtub. Every two to seven years, the water in that bathtub swings between running a little warmer than usual (scientists call this <strong>El Niño</strong>) and a little cooler than usual (<strong>La Niña</strong>). This whole back-and-forth swing has a name: <GlossaryTooltip term="ENSO">ENSO</GlossaryTooltip>, short for the <strong>El Niño–Southern Oscillation</strong>. Scientists track it with one simple number, the <GlossaryTooltip term="Niño 3.4 index">Niño 3.4 index</GlossaryTooltip> — the same way a doctor tracks your health with one number on a thermometer <span className="text-white/50 text-sm">(Trenberth, 1997)</span>.</p>
            <p>Here's why a farmer 8,000 km away should care: this ocean temperature swing doesn't stay in the water. Like a stone dropped into a pond sends ripples all the way to the far shore, a warmer or cooler Pacific sends ripples through wind patterns, air pressure, and rainfall all across the planet. Scientists call this a <GlossaryTooltip term="teleconnection">teleconnection</GlossaryTooltip> — literally, a "connection from far away." South Asia's monsoon, the rainy season that fills up Bangladesh's rivers, turns out to be one of the systems that feels this ripple the most <span className="text-white/50 text-sm">(Mohsin et al., 2025)</span>.</p>
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
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 2</strong> That shift changes the big wind and pressure patterns blowing across Asia.</li>
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 3</strong> Those changed winds change how much rain falls over the Himalayan foothills and the Brahmaputra basin during monsoon season.</li>
                  <li className="pl-0"><strong className="text-accent block text-xl mb-1 font-display">Domino 4</strong> That rainfall, combined with melting snow and water flowing in from upstream, decides how high the rivers rise inside Bangladesh.</li>
                </ul>
                <p className="mt-8">This last domino is well documented. The severe 2017 Brahmaputra flood, for example, happened mainly because of an unusually high number of intense rainfall bursts feeding straight into the river system <span className="text-white/50 text-sm">(Hossain et al., 2019)</span>. Studies focused specifically on Bangladesh confirm that <GlossaryTooltip term="ENSO">ENSO</GlossaryTooltip> really does act as an early signal for monsoon rainfall here <span className="text-white/50 text-sm">(Mohsin et al., 2025); (Ehsan et al., 2023)</span>.</p>
                <p>But it isn't a perfectly predictable row of dominoes — sometimes one wobbles instead of falling cleanly, and the whole chain gets noisier or weaker over time <span className="text-white/50 text-sm">(McPhaden et al., 2006)</span>. That's exactly why OceanSense can't just "predict the ocean" and call it done. It has to walk the entire chain, one domino at a time.</p>
              </>
            }
          />

          <ArticleSection variant="standard" id="problem" index="04 — Why Existing Systems Fall Short" title="If scientists already know ENSO affects Bangladesh, why isn't this solved already?">
            <p>Three gaps keep showing up, again and again, in the research.</p>
            <p><strong>Gap 1:</strong> Seasonal climate forecasts are often either not accurate enough, or don't give enough advance warning, for real disaster planning <span className="text-white/50 text-sm">(G.-G. Wang et al., 2023); (Fang et al., 2022)</span>.</p>
            <p><strong>Gap 2:</strong> There's a missing translator between <em>global</em> ocean forecasts and <em>local</em> river conditions — almost nobody connects the two <span className="text-white/50 text-sm">(Mohsin et al., 2025)</span>. It's a bit like having a weather report for the whole planet, but nothing that tells you whether to carry an umbrella on your own street.</p>
            <p><strong>Gap 3:</strong> Even when a solid forecast exists, there's rarely a simple system that turns it into a plain warning a community can actually act on.</p>
            <p>There's also a modeling problem underneath all this. Older statistical methods (like ARIMA, a classic forecasting formula) are too rigid to capture how messy and unpredictable ocean-atmosphere behaviour really is <span className="text-white/50 text-sm">(Xiaoqun et al., 2020)</span>. Even modern forecasts hit a well-known wall called the <strong>Spring Predictability Barrier</strong> — think of it as a seasonal "fog" during which <GlossaryTooltip term="ENSO">ENSO</GlossaryTooltip> forecasts made in spring become far less trustworthy, the same way a weather app struggles more on a day when the sky keeps changing its mind <span className="text-white/50 text-sm">(Xiaoqun et al., 2020)</span>.</p>
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
                    <p className="text-base text-white/70">Runs the full relay: ENSO forecast → rainfall forecast → river-level forecast, looking as far as <strong>12 months</strong> ahead. The moment a station's predicted water level reaches or crosses <strong>22 metres</strong> — the official danger line set by the <GlossaryTooltip term="BWDB">BWDB</GlossaryTooltip> for the Brahmaputra–Jamuna basin — the system raises a flood-risk flag, the same way a smoke detector goes off the second smoke crosses a set level.</p>
                  </motion.li>
                </motion.ul>
              </>
            }
          />

          <ArticleSection variant="glass-card" id="data" index="06 — The Raw Material" title="Where does OceanSense actually get its information?">
            <p>Any AI model is only as good as what you feed it — a recipe is only as good as its ingredients. OceanSense uses two "ingredient baskets," both from public, trustworthy sources, not anything private or made up.</p>
            <p><strong>Basket 1 — the ocean's vital signs.</strong> Sea surface temperature, wind stress, air pressure, and ocean heat, pulled from the Copernicus Climate Data Store's ORAS5 ocean reanalysis and NOAA, with monthly records stretching from 2006 to 2025. Think of this basket as the ocean's medical chart.</p>
            <p><strong>Basket 2 — the rivers' vital signs.</strong> River water level, rainfall, and soil moisture, collected from the Bangladesh Water Development Board (BWDB) and NASA POWER, for three flood-prone spots along the Brahmaputra–Jamuna basin: Kurigram, Gaibandha, and Jamalpur. These three were picked because they're among the places that flood most consistently, year after year.</p>
            
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-5 my-6 text-sm text-white/80">
              <strong className="text-warning block mb-1">Why only three stations?</strong> 
              Long, unbroken, twenty-year water-level records are surprisingly hard to find — and for these stations, much of the BWDB data had to be pulled together by hand, page by page. It's a real limitation, and the team is upfront about it (see "Limits," below).
            </div>
            
            <div className="mt-8 mb-4">
              <ArticleImage src="/article/4.png" alt="Map of Bangladesh showing the 3 river stations: Kurigram, Gaibandha, and Jamalpur" />
            </div>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="pipeline" index="07 — From Raw Numbers to Model-Ready Data" title="What actually happens to the data before the AI ever sees it?">
            <p>"Data" here isn't one single thing — it's five different shapes of information, each measured differently and needing its own kind of cleanup. It's a bit like how you can't wash vegetables, meat, and rice the same way before cooking them:</p>
            <ul className="space-y-2">
              <li>Photos from space (NDVI, LST)</li>
              <li>Weather re-built by computer (SST, SLP, OLR)</li>
              <li>Real gauge readings (river water level)</li>
              <li>Fixed map info (station locations)</li>
              <li>Daily spreadsheet numbers (rainfall, soil moisture)</li>
            </ul>

            <p className="mt-8 mb-4 font-bold text-accent">Where each ingredient actually comes from:</p>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 backdrop-blur-md mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 font-mono text-white/50 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Variable</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/90">Sea Surface Temp. (SST)</td>
                    <td className="px-4 py-3 text-accent"><a href="https://cds.climate.copernicus.eu" target="_blank" rel="noreferrer">Copernicus / ORAS5</a></td>
                    <td className="px-4 py-3 text-white/50">2006–2025, monthly</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/90">Sea Level Pressure (SLP)</td>
                    <td className="px-4 py-3 text-accent"><a href="https://ncei.noaa.gov/cdo-web" target="_blank" rel="noreferrer">NOAA CDO</a></td>
                    <td className="px-4 py-3 text-white/50">2006–2025, monthly</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/90">Outgoing Longwave Radiation</td>
                    <td className="px-4 py-3 text-accent"><a href="https://psl.noaa.gov" target="_blank" rel="noreferrer">NOAA PSL</a></td>
                    <td className="px-4 py-3 text-white/50">2006–2025, monthly</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/90">Niño 3.4 Index</td>
                    <td className="px-4 py-3 text-accent"><a href="https://ncei.noaa.gov/cdo-web" target="_blank" rel="noreferrer">NOAA CDO</a></td>
                    <td className="px-4 py-3 text-white/50">2006–2025, monthly</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/90">Water Level (3 stations)</td>
                    <td className="px-4 py-3 text-accent"><a href="https://hydrology.bwdb.gov.bd" target="_blank" rel="noreferrer">BWDB</a></td>
                    <td className="px-4 py-3 text-white/50">2006–2025, daily</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/90">Rainfall & Soil Moisture</td>
                    <td className="px-4 py-3 text-accent"><a href="https://power.larc.nasa.gov" target="_blank" rel="noreferrer">NASA POWER</a></td>
                    <td className="px-4 py-3 text-white/50">2006–2025, daily</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p><strong>Turning raw numbers into something a model can actually use.</strong> The global climate data arrives as a huge grid of numbers spread across the whole map — like a spreadsheet with millions of cells, and most of those cells barely matter on their own. Here's what happens to it, step by step:</p>
            
            <ul className="space-y-4 my-6">
              <li><strong>Step 1 — put everything on the same scale.</strong> "Temperature" and "pressure" are measured in totally different units, so the pipeline rescales every variable first, the same way you'd convert both feet and centimetres into one unit before comparing two people's heights.</li>
              <li><strong>Step 2 — shrink it down with PCA.</strong> <GlossaryTooltip term="PCA">PCA</GlossaryTooltip> stands for Principal Component Analysis, which sounds complicated but does something simple: it's like summarizing a 300-page book down to the ten sentences that actually matter, and quietly throwing away the repetitive filler.</li>
              <li><strong>Step 3 — group it into 12-month windows.</strong> Instead of looking at one lonely snapshot in time, the model is shown twelve months at once, like flipping through a full year of photos together, so it can learn the seasonal rhythm instead of a single frozen moment.</li>
            </ul>

            <p>The river-station data gets its own, simpler cleanup: incomplete records are thrown out, dates are lined up in the correct order, and a month feature is added so the model always knows whether it's looking at monsoon season or dry season <span className="text-white/50 text-sm">(Hossain et al., 2019)</span>. Kurigram, Gaibandha, and Jamalpur are each handled separately, since every station has its own local rainfall and flood personality.</p>
            
            <p>One feature the team built by hand deserves a mention — the rainfall anomaly. In plain words, it just answers one question: "was this month wetter or drier than usual?"</p>

            <div className="glass-dark border border-accent/30 rounded-2xl p-8 my-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="font-mono text-xl md:text-2xl text-accent font-bold mb-4 relative z-10">
                Rainfall Anomaly = (R - R<sub>mean</sub>) / R<sub>mean</sub> × 100
              </div>
            </div>

            <p>You don't need to read the formula to get the idea — here's an example. Say a station usually gets 150mm of rain in July, but this July it got 200mm. That's +33%: a third more rain than normal. A positive number means wetter than usual; a negative number means drier than usual. This is a standard way climate scientists measure how extreme a month really was <span className="text-white/50 text-sm">(Hossain et al., 2019)</span>.</p>
            
            <p><strong>Testing fair and square.</strong> Because this is time-based data, the model is never allowed to "cheat" by peeking at the future. It's the same rule as a real exam: you can only study from past papers, never from tomorrow's answer key. Picture it this way: if OceanSense had 20 years of data, the global models would train on roughly the first 14 years, check their own progress on the next 3 years, and then take a final, one-time test on the last 3 years — years the model has genuinely never seen before. (The exact split is 70% / 15% / 15% for the global models, and 80% / 20% for the local river models.) Nothing is shuffled — the data always stays in the order it actually happened, because that's the only fair way to test whether a model can predict a future it hasn't already memorized.</p>
            
            <p className="text-sm text-white/50">Note: one small technical detail — feature scaling was skipped for XGBoost on purpose, since tree-based models don't care whether a number is "5" or "5,000"; they only care about the order <span className="text-white/50 text-sm">(Shen, 2018)</span>.</p>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="learn" index="08 — Inside the Machine" title="How does the AI actually learn to read the ocean and the rivers?">
            <p>The team didn't just pick one AI method and hope for the best — they put five different "AI brains" through a head-to-head competition for ocean prediction, and ran a similar contest for river prediction. The clear winner, and the one worth actually understanding, was <GlossaryTooltip term="XGBoost">XGBoost</GlossaryTooltip>.</p>
            <p><strong>XGBoost.</strong> Picture hundreds of tiny decision-makers, each one asking one simple question, like "was the temperature above 27°C?" Every decision-maker votes, and all the votes are combined into one final answer. It's especially strong at reading data that's already organized into neat rows and columns, like a spreadsheet <span className="text-white/50 text-sm">(T. Chen & Guestrin, 2016)</span>.</p>
            
            <p>Every model was graded on the same three-question report card:</p>
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
                <div className="text-xs text-white/60">How much of the real-world pattern the model explains. 1.0 is a perfect score, 0 is no better than average.</div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="results" index="09 — The Scorecard" title="Which model actually won — and why did some fail so badly?">
            <p>Quick reminder before the numbers: for the first two columns (MAE, RMSE), a smaller number is better, like a golf score. For the last column (R²), a bigger number is better, like a percentage — 1.0 is a perfect 100%.</p>
            <p>For predicting the ocean's ENSO state, one model pulled far ahead of the rest: <strong>XGBoost won clearly</strong>, correctly explaining over 90% of what actually happened in the real world — like a student scoring 90 on a test where everyone else is stuck around 50 or lower:</p>
            
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
                  <tr className="hover:bg-white/5 transition-colors cursor-default">
                    <td className="px-6 py-5 text-white/90">ConvLSTM</td>
                    <td className="px-6 py-5 text-white/50">4.750</td>
                    <td className="px-6 py-5 text-white/50">6.341</td>
                    <td className="px-6 py-5 text-white/50">0.009</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p>To put a real number on it: an RMSE of 0.486 here means XGBoost's guesses for the <GlossaryTooltip term="Niño 3.4 index">Niño 3.4 index</GlossaryTooltip> were typically off by less than half a degree Celsius — a tiny margin for something this hard to predict months out.</p>
            <p>The standalone LSTM actually scored <em>below zero</em> — meaning it did worse than a lazy forecaster who just guesses "the average" every single time. The reason is fairly intuitive: ENSO is fundamentally about the whole ocean's shape and geography, and a model with no built-in sense of "where" struggles to represent that <span className="text-white/50 text-sm">(Ham et al., 2019)</span>.</p>
            <p>For local river water levels, the story flipped a little: LSTM and XGBoost both did well here too (R² reaching 0.905 and 0.881 respectively across stations), while the Graph Neural Networks mostly failed, scoring below zero. The likely reason is simple: GNNs need a big, richly connected network to learn anything useful, and three stations is a bit like trying to understand a whole city's traffic from just three intersections <span className="text-white/50 text-sm">(Jafarzadegan et al., 2023)</span>.</p>
            <p>The best result of the entire study came from combining two strengths instead of picking just one: a hybrid <strong>XGBoost–<GlossaryTooltip term="LSTM">LSTM</GlossaryTooltip> model</strong>, pairing XGBoost's talent for spotting tricky relationships with LSTM's talent for remembering seasonal rhythm, reached <strong>R² up to 0.923</strong> at the best-performing station — the lowest error of any model tested <span className="text-white/50 text-sm">(T. Chen & Guestrin, 2016)</span>.</p>
            <p>Not every station behaved the same way. One station consistently scored lower (R² around 0.66) than the other two — a reminder that even the best model is only ever as reliable as the data feeding it, the same way even a great cook can't save a dish made with bad ingredients.</p>
          </ArticleSection>

          <ArticleSection variant="standard" id="forecast" index="10 — Looking Ahead" title="What does OceanSense actually predict is coming in 2026?">
            <PullQuote>
              The model projects neutral ENSO conditions through the coming year.
            </PullQuote>
            <p>Running the whole pipeline forward, like a weather forecast for the year ahead, the model projects neutral ENSO conditions through the coming year — the Niño 3.4 index is expected to stay within the normal, calm range of −0.5 to +0.5. In plain terms: no strong El Niño or La Niña is expected to stir up extreme weather.</p>
            <p>Following that signal all the way downstream, the pipeline forecasts that water levels at Kurigram, Gaibandha, and Jamalpur will <strong>stay below the 22-metre danger line throughout 2026</strong>, following the usual seasonal shape: a gentle rise from January to May, a peak during the core monsoon months of June to September, and a gradual fall back down from October to December — matching the well-known seasonal rhythm of the Brahmaputra–Jamuna basin <span className="text-white/50 text-sm">(Hossain et al., 2019)</span>.</p>
            <p>In short: <strong className="text-success">moderate flood risk, no extreme flooding expected</strong> — but with one honest caveat. This forecast is only as good as the ENSO projection it starts from, the same way a delivery time estimate is only as good as the traffic report it's based on. If real-world ENSO behaves differently than assumed, that error travels straight down the chain into the rainfall and river-level forecasts.</p>
          </ArticleSection>
          
          <ArticleSection variant="standard" id="matters" index="11 — The Human Payoff" title="Why does having twelve months of notice actually matter to real people?">
            <p>A week's warning lets you move your furniture to higher ground. A year's warning lets you change your decisions before they're locked in: choosing a flood-resistant seed variety before planting season instead of after the crop is already in the ground, reinforcing an embankment while it's still dry season, planning an evacuation route ahead of time, or moving community resources into place before a crisis hits — instead of scrambling after.</p>
            <p>The stakes here are not abstract. Field surveys of Bangladesh's riverine char (river-island) communities have found flood and erosion events causing crop damage above 90% in affected areas, with erosion itself acting as a major long-term driver of displacement <span className="text-white/50 text-sm">(Islam, 2017)</span>. Extra lead time is one of the few real levers that can meaningfully shrink that damage before it ever happens.</p>
            <p>At a policy level, this work is a direct contribution to <strong>UN Sustainable Development Goal 13 (Climate Action)</strong>, and indirectly supports SDG 11 (Sustainable Cities and Communities) by helping vulnerable riverine communities plan rather than react.</p>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="limits" index="12 — Being Honest" title="What can't OceanSense do — at least, not yet?">
            <p>No forecasting system is a crystal ball, and the team is upfront about exactly where this one still has rough edges.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">Depends on the ENSO input</div>
                <div className="text-sm text-white/60">If the starting ocean forecast is wrong, every prediction built on top of it inherits that mistake — like a house built on a shaky foundation.</div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">Only 3 stations</div>
                <div className="text-sm text-white/60">Kurigram, Gaibandha, and Jamalpur represent the wider basin well, but they aren't the whole country.</div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">No river physics</div>
                <div className="text-sm text-white/60">This is a pattern-recognition system, not a physical simulation of how water actually flows and moves through the land, which can make it less reliable during rare, extreme events <span className="text-white/50 text-sm">(Jafarzadegan et al., 2023)</span>.</div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-xl hover:border-white/20 transition-colors">
                <div className="text-white font-bold mb-2 font-display">Data gaps</div>
                <div className="text-sm text-white/60">Public records sometimes have missing or messy stretches, and gaps like that can quietly bias what the model learns.</div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection variant="standard" id="next" index="13 — Where This Goes Next" title="What's the plan for turning this from a research prototype into something people actually use?">
            <p>Turning this from a research project into something a real community can use is planned in three steps, like building a house floor by floor.</p>
            <p><strong>Phase 1</strong> is a web dashboard showing ENSO, rainfall, and water-level forecasts, with the flood threshold drawn right on the chart so anyone can see at a glance whether the line is close to being crossed. (You are looking at this now.)</p>
            <p><strong>Phase 2</strong> is a mobile app, built with Flutter, that works even offline and sends real-time flood alerts straight to someone's phone.</p>
            <p><strong>Phase 3</strong> connects everything to live data feeds from NOAA, NASA, and BWDB so the whole pipeline updates itself automatically — turning it into a genuine <strong>Decision Support System</strong> that disaster management authorities can actually rely on.</p>
            <p>The team estimated a full project budget of around ৳725,000 for a four-person team over a year — including computing hardware, cloud costs, data access, and an SMS alert gateway for community dissemination.</p>
          </ArticleSection>

          <ArticleSection variant="glass-card" id="stack" index="14 — Under the Hood" title="What was OceanSense actually built with?">
            <p>None of this is exotic, secret technology. It's a careful combination of well-known, mostly free and open-source tools — the same kind of building blocks used across the AI and data science world — chosen because they're reliable, not because they're trendy.</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Languages</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>Python</span>
                  <span>JavaScript (React.js)</span>
                  <span>SQL</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Machine Learning</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>XGBoost</span>
                  <span>PyTorch</span>
                  <span>TensorFlow / Keras</span>
                  <span>PyTorch Geometric (GNNs)</span>
                  <span>scikit-learn</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Data Processing</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>Xarray & NetCDF4</span>
                  <span>Pandas / NumPy</span>
                  <span>GeoPandas & Shapely</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Data Providers</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>Copernicus CDS API</span>
                  <span>NOAA PSL API</span>
                  <span>Google Earth Engine</span>
                  <span>BWDB</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Visualization</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>Leaflet.js / Mapbox GL JS</span>
                  <span>Matplotlib</span>
                  <span>Seaborn</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold">Infrastructure</h4>
                <div className="flex flex-col gap-1 text-sm text-white/70">
                  <span>PostgreSQL + PostGIS</span>
                  <span>AWS S3 / Google Cloud Storage</span>
                  <span>Docker</span>
                  <span>FastAPI / Flask</span>
                  <span>Twilio SMS Gateway</span>
                </div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection variant="standard" id="glossary" index="15 — Key Terms, Explained Simply" title="What do all these technical words actually mean?">
            <p>A short, plain-English glossary for anyone who wants to skim the jargon without losing the meaning — like a cheat sheet you can keep next to the article.</p>
            <div className="space-y-6 mt-6">
              {[
                { term: 'ENSO', def: 'The El Niño–Southern Oscillation — the natural warming/cooling cycle of the tropical Pacific Ocean that reshapes weather worldwide.' },
                { term: 'Niño 3.4 Index', def: 'The single number scientists use to officially track whether the Pacific is in an El Niño, La Niña, or neutral state.' },
                { term: 'Teleconnection', def: 'A statistical link between weather in one part of the world and weather thousands of kilometres away — like the Pacific and the Bangladesh monsoon.' },
                { term: 'Spring Predictability Barrier', def: 'A well-known seasonal blind spot where ENSO forecasts made in spring become far less reliable than forecasts made at other times of year.' },
                { term: 'Lead Time', def: 'How far in advance a forecast is made — the whole point of OceanSense is stretching this from days to months.' },
                { term: 'XGBoost', def: 'A machine learning method that builds many small decision trees and combines them, especially strong on structured, table-shaped data.' },
                { term: 'LSTM', def: 'A type of neural network with a built-in "memory," designed to understand patterns that unfold over a sequence of time.' },
                { term: 'Attention Mechanism', def: 'A technique that lets a model automatically weigh which past time steps matter most, instead of treating every month equally.' },
                { term: 'GNN', def: 'Graph Neural Network — a model designed to learn from how points (like river stations) are connected to each other, similar to a road map.' },
                { term: 'PCA', def: 'Principal Component Analysis — a way of compressing large, complex data down to its most important patterns, discarding redundant noise.' },
                { term: 'R² (R-squared)', def: 'A score from roughly 0 to 1 showing how much of the real-world pattern a model actually explains. 1.0 is perfect; 0 is no better than guessing the average; negative is worse than that.' },
                { term: 'RMSE / MAE', def: 'Two ways of measuring average prediction error — RMSE punishes big mistakes more harshly, MAE treats every error equally.' },
                { term: 'BWDB', def: 'The Bangladesh Water Development Board — the government body that sets official river danger levels, including the 22m flood threshold used throughout this project.' }
              ].map(item => (
                <div key={item.term} className="border-b border-white/5 pb-4 last:border-0">
                  <dt className="font-mono text-sm text-accent font-bold mb-1">{item.term}</dt>
                  <dd className="text-base text-white/70 leading-relaxed">{item.def}</dd>
                </div>
              ))}
            </div>
          </ArticleSection>

          {/* Footer */}
          <footer className="mt-24 pt-16 border-t border-white/10 pb-20">
            <div className="glass-dark border border-white/10 rounded-3xl p-10 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
              <h3 className="font-display font-bold text-2xl text-white mb-4 mt-0 relative z-10">About this research</h3>
              <p className="text-base text-white/70 leading-[1.75] mb-10 relative z-10">
                OceanSense: An AI-Powered ENSO Early Disaster Warning System is a CSE 4098B capstone project at the University of Liberal Arts Bangladesh (ULAB), Spring 2026, by <strong>Faria Islam Sara, Md Maruf Hossain, Rabbi Sadnan Khan,</strong> and <strong>Rakibul Hasan</strong>, under the supervision of <strong>Nasir Uddin Ahmed</strong>. This article is a plain-language companion to the full capstone report and is not a substitute for it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10 relative z-10">
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-3 font-bold">Fall '25</span>
                  <p className="text-sm text-white/60">Domain selection, problem framing, and the first pass of literature review.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-3 font-bold">Spring '26</span>
                  <p className="text-sm text-white/60">Dataset collection, methodology design, model selection, and prototype development.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-3 font-bold">Summer '26</span>
                  <p className="text-sm text-white/60">Core system build, testing, performance evaluation, and final report writing.</p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest font-bold mb-6">References</h3>
              <ul className="space-y-4 text-xs text-white/40 leading-relaxed font-sans">
                <li>Trenberth, K. E. (1997). The definition of El Niño. <em>Bulletin of the American Meteorological Society</em>, 78(12), 2771–2778.</li>
                <li>McPhaden, M. J., Zebiak, S. E., & Glantz, M. H. (2006). ENSO as an integrating concept in earth science. <em>Science</em>, 314(5806), 1740–1745.</li>
                <li>Mohsin, M., Ghosh, T., Akter, F., Sarkar, S., & Mullick, M. R. (2025). Seasonal weather pattern prediction from ENSO indices using machine learning.</li>
                <li>Ehsan, M. A., Tippett, M. K., Robertson, A. W., Singh, B., & Rahman, M. A. (2023). The ENSO fingerprint on Bangladesh summer monsoon rainfall. <em>Earth Systems and Environment</em>, 7(3), 617–627.</li>
                <li>Hossain, S., Cloke, H. L., Fıcchı, A., Turner, A. G., & Stephens, E. (2019). Hydrometeorological drivers of the 2017 flood in the Brahmaputra basin in Bangladesh. <em>Hydrology and Earth System Sciences Discussions</em>.</li>
                <li>Wang, G.-G., Cheng, H., Zhang, Y., & Yu, H. (2023). ENSO analysis and prediction using deep learning: A review. <em>Neurocomputing</em>, 520, 216–229.</li>
                <li>Fang, W., Sha, Y., & Sheng, V. S. (2022). Survey on the application of artificial intelligence in ENSO forecasting. <em>Mathematics</em>, 10(20), 3793.</li>
                <li>Xiaoqun, C., Yanan, G., Bainian, L., Kecheng, P., Guangjie, W., & Mei, G. (2020). ENSO prediction based on long short-term memory (LSTM). <em>IOP Conference Series: Materials Science and Engineering</em>, 799, 012035.</li>
                <li>Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. <em>In Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining</em> (pp. 785–794).</li>
                <li>Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. <em>Neural Computation</em>, 9(8), 1735–1780.</li>
                <li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. <em>Advances in Neural Information Processing Systems</em>, 30.</li>
                <li>Ham, Y.-G., Kim, J.-H., & Luo, J.-J. (2019). Deep learning for multi-year ENSO forecasts. <em>Nature</em>, 573(7775), 568–572.</li>
                <li>Jafarzadegan, K., Moradkhani, H., Pappenberger, F., Moftakhari, H., Bates, P., Abbaszadeh, P., et al. (2023). Recent advances and new frontiers in riverine and coastal flood modeling. <em>Reviews of Geophysics</em>, 61(2), e2022RG000788.</li>
                <li>Islam, S. (2017). Assessment of the impact and management of flood, drought and river bank erosion: A case study of char land peoples of Gangachara Upazila, Rangpur district, Bangladesh. <em>Imperial Journal of Interdisciplinary Research</em>, 3(4), 96–111.</li>
                <li>Shen, C. (2018). A transdisciplinary review of deep learning research and its relevance for water resources scientists. <em>Water Resources Research</em>, 54(11), 8558–8593.</li>
              </ul>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
