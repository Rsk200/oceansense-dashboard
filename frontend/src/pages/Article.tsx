import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ArticleSection from '../components/article/ArticleSection';
import ArticleImage from '../components/article/ArticleImage';
import AnimatedGauge from '../components/article/AnimatedGauge';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

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
  { id: 'refs', label: 'References' },
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
    <div className="min-h-screen bg-article-navy text-article-ivory font-sans selection:bg-article-gold selection:text-article-navy pb-10">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-article-navy/90 backdrop-blur-md border-b border-article-panel-line overflow-x-auto">
        <div className="flex gap-[22px] py-3.5 max-w-[1040px] mx-auto px-6 whitespace-nowrap">
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-article-ivory-dim pb-1 border-b-2 border-transparent hover:text-article-teal hover:border-article-teal flex items-center transition-colors">
            <ChevronLeft className="w-3 h-3 mr-1" /> Home
          </Link>
          <div className="w-px h-4 bg-article-panel-line my-auto" />
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`font-mono text-xs uppercase tracking-widest pb-1 border-b-2 transition-colors ${
                activeSection === section.id 
                  ? 'text-article-gold border-article-gold' 
                  : 'text-article-ivory-dim border-transparent hover:text-article-gold hover:border-article-gold'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-24 pb-16 border-b border-article-panel-line overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute -top-[10%] left-[15%] w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-article-gold/10 to-transparent blur-3xl" />
          <div className="absolute top-[10%] left-[90%] -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-article-teal/15 to-transparent blur-3xl" />
        </div>
        
        <div className="max-w-[760px] mx-auto px-6 relative z-10">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-article-teal mb-[18px] flex items-center gap-2.5">
            <span className="w-[22px] h-px bg-article-teal inline-block" />
            OceanSense · AI Early Warning Research
          </div>
          
          <motion.h1 
            className="font-article font-semibold text-[clamp(34px,5.4vw,56px)] leading-[1.06] mb-[22px] tracking-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          >
            Can we see Bangladesh's next <em className="not-italic text-article-gold">big flood</em> — a year before it arrives?
          </motion.h1>
          
          <motion.p 
            className="text-[19px] text-article-ivory-dim max-w-[620px] mb-11 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          >
            Imagine getting a flood warning a full year in advance — not just a few days. That's the idea behind OceanSense: an AI system that connects ocean temperatures 8,000 km away in the Pacific to river levels in Kurigram, Gaibandha, and Jamalpur.
          </motion.p>

          <AnimatedGauge />

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-article-panel-line mt-8 pt-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="sm:border-r border-b sm:border-b-0 border-article-panel-line pr-5 pb-4 sm:pb-0 mb-4 sm:mb-0">
              <span className="font-article font-bold text-[38px] text-article-gold block leading-none">12</span>
              <span className="text-[13px] text-article-ivory-dim mt-2 block">months of forecast lead time — instead of days</span>
            </div>
            <div className="sm:border-r border-b sm:border-b-0 border-article-panel-line sm:pl-5 pr-5 pb-4 sm:pb-0 mb-4 sm:mb-0">
              <span className="font-article font-bold text-[38px] text-article-gold block leading-none">170M+</span>
              <span className="text-[13px] text-article-ivory-dim mt-2 block">people living in Bangladesh's low-lying river delta</span>
            </div>
            <div className="sm:pl-5">
              <span className="font-article font-bold text-[38px] text-article-gold block leading-none">18M</span>
              <span className="text-[13px] text-article-ivory-dim mt-2 block">people affected by flooding in 2024 alone</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-6">
        
        {/* Sections */}
        <ArticleSection id="why" index="01 — The Problem, In Human Terms" title="Why does Bangladesh need a completely new kind of flood warning?">
          <p>Picture a farmer in Kurigram, watching a rice field that isn't ready to harvest yet. Three enormous rivers — the Ganges, the Brahmaputra, and the Jamuna — all meet in Bangladesh, and more than <strong>170 million people</strong> live on land so flat that a single bad flood can wipe out a whole season's income overnight. In <strong>2024 alone, flooding affected roughly 18 million people and caused over one billion US dollars in damage.</strong></p>
          <p>Today, most flood warnings arrive only a <strong>few days to a week</strong> before the water actually rises. That's enough time to move a bicycle or a cow to higher ground — but nowhere near enough time to plant a flood-resistant crop instead, or reinforce a mud embankment while the ground is still dry. It's a bit like finding out about an important exam the night before, instead of getting a whole semester to prepare for it.</p>
          <p>OceanSense started with one simple question: <em className="text-article-gold">what if the ocean itself could warn us, months in advance, that a flood is coming?</em></p>
        </ArticleSection>

        <ArticleSection id="enso" index="02 — The Ocean Signal" title="What is ENSO, and why should a farmer in Kurigram care about the Pacific Ocean?">
          <p>Think of the tropical Pacific Ocean as a giant bathtub. Every two to seven years, the water in that bathtub swings between running a little warmer than usual (scientists call this <strong>El Niño</strong>) and a little cooler than usual (<strong>La Niña</strong>). This whole back-and-forth swing has a name: <strong>ENSO</strong>, short for the <strong>El Niño–Southern Oscillation</strong>. Scientists track it with one simple number, the <strong>Niño 3.4 index</strong> — the same way a doctor tracks your health with one number on a thermometer.</p>
          <p>Here's why a farmer 8,000 km away should care: this ocean temperature swing doesn't stay in the water. Like a stone dropped into a pond sends ripples all the way to the far shore, a warmer or cooler Pacific sends ripples through wind patterns, air pressure, and rainfall all across the planet. Scientists call this a <strong>teleconnection</strong> — literally, a "connection from far away." South Asia's monsoon, the rainy season that fills up Bangladesh's rivers, turns out to be one of the systems that feels this ripple the most.</p>
          <ArticleImage src="/article/1.png" alt="Map showing ENSO teleconnections" />
        </ArticleSection>

        <ArticleSection id="link" index="03 — The Chain Reaction" title="How exactly does a warmer Pacific Ocean end up flooding a river 8,000 km away?">
          <p>Think of it like four dominoes standing in a row, each one knocking over the next. <strong>Domino 1:</strong> the Pacific Ocean's surface temperature shifts into an El Niño or La Niña state. <strong>Domino 2:</strong> that shift changes the big wind and pressure patterns blowing across Asia. <strong>Domino 3:</strong> those changed winds change how much rain falls over the Himalayan foothills and the Brahmaputra basin during monsoon season. <strong>Domino 4:</strong> that rainfall, combined with melting snow and water flowing in from upstream, decides how high the rivers rise inside Bangladesh.</p>
          <p>This last domino is well documented. The severe 2017 Brahmaputra flood, for example, happened mainly because of an unusually high number of intense rainfall bursts feeding straight into the river system. Studies focused specifically on Bangladesh confirm that ENSO really does act as an early signal for monsoon rainfall here.</p>
          <p>But it isn't a perfectly predictable row of dominoes — sometimes one wobbles instead of falling cleanly, and the whole chain gets noisier or weaker over time. That's exactly why OceanSense can't just "predict the ocean" and call it done. It has to walk the entire chain, one domino at a time.</p>
          <ArticleImage src="/article/2.png" alt="Chain reaction infographic" />
        </ArticleSection>

        <ArticleSection id="problem" index="04 — Why Existing Systems Fall Short" title="If scientists already know ENSO affects Bangladesh, why isn't this solved already?">
          <p>Three gaps keep showing up, again and again, in the research. <strong>Gap 1:</strong> seasonal climate forecasts are often either not accurate enough, or don't give enough advance warning, for real disaster planning. <strong>Gap 2:</strong> there's a missing translator between <em>global</em> ocean forecasts and <em>local</em> river conditions — almost nobody connects the two. It's a bit like having a weather report for the whole planet, but nothing that tells you whether to carry an umbrella on your own street. <strong>Gap 3:</strong> even when a solid forecast exists, there's rarely a simple system that turns it into a plain warning a community can actually act on.</p>
          <p>There's also a modeling problem underneath all this. Older statistical methods (like ARIMA, a classic forecasting formula) are too rigid to capture how messy and unpredictable ocean-atmosphere behaviour really is. Even modern forecasts hit a well-known wall called the <strong>Spring Predictability Barrier</strong> — think of it as a seasonal "fog" during which ENSO forecasts made in spring become far less trustworthy, the same way a weather app struggles more on a day when the sky keeps changing its mind.</p>
        </ArticleSection>

        <ArticleSection id="what" index="05 — Meet the System" title="So, in plain terms — what actually is OceanSense?">
          <p>In plain terms, OceanSense is three "helpers" working together like a relay race, where each runner hands the baton to the next:</p>
          <p><strong>Helper 1 — Watches the ocean.</strong> Looks at global sea surface temperature, wind, and pressure, and predicts what state ENSO will be in.</p>
          <p><strong>Helper 2 — Listens to the rivers.</strong> Takes local rainfall, soil moisture, and Helper 1's ENSO prediction, and estimates how high the water will get at specific river stations.</p>
          <p><strong>Helper 3 — Connects the dots.</strong> Runs the full relay: ENSO forecast → rainfall forecast → river-level forecast, looking as far as <strong>12 months</strong> ahead. The moment a station's predicted water level reaches or crosses <strong>22 metres</strong> — the official danger line set by the Bangladesh Water Development Board for the Brahmaputra–Jamuna basin — the system raises a flood-risk flag, the same way a smoke detector goes off the second smoke crosses a set level.</p>
          <ArticleImage src="/article/3.png" alt="OceanSense system diagram" />
        </ArticleSection>

        <ArticleSection id="data" index="06 — The Raw Material" title="Where does OceanSense actually get its information?">
          <p>Any AI model is only as good as what you feed it — a recipe is only as good as its ingredients. OceanSense uses two "ingredient baskets," both from public, trustworthy sources, not anything private or made up.</p>
          <p><strong>Basket 1 — the ocean's vital signs.</strong> Sea surface temperature, wind stress, air pressure, and ocean heat, pulled from the Copernicus Climate Data Store's ORAS5 ocean reanalysis and NOAA, with monthly records stretching from <strong>2006 to 2025</strong>. Think of this basket as the ocean's medical chart.</p>
          <p><strong>Basket 2 — the rivers' vital signs.</strong> River water level, rainfall, and soil moisture, collected from the Bangladesh Water Development Board (BWDB) and NASA POWER, for three flood-prone spots along the Brahmaputra–Jamuna basin: <strong>Kurigram, Gaibandha, and Jamalpur</strong>. These three were picked because they're among the places that flood most consistently, year after year.</p>
          <div className="bg-article-panel border border-article-panel-line border-l-[3px] border-l-article-gold rounded-[10px] p-[18px_20px] my-[22px] text-[15px] text-article-ivory-dim">
            <strong className="text-article-ivory">Why only three stations?</strong> Long, unbroken, twenty-year water-level records are surprisingly hard to find — and for these stations, much of the BWDB data had to be pulled together by hand, page by page. It's a real limitation, and the team is upfront about it (see "Limits," below).
          </div>
          <ArticleImage src="/article/4.png" alt="Map of Bangladesh river stations" />
        </ArticleSection>

        {/* ... More sections to be continued in next tool call ... */}
        
        <ArticleSection id="pipeline" index="07 — From Raw Numbers to Model-Ready Data" title="What actually happens to the data before the AI ever sees it?">
          <p>The raw numbers go through a rigorous pipeline. Time-series are aligned, variables are normalized, and <strong>Principal Component Analysis (PCA)</strong> is used to reduce the massive dimensionality of global climate maps down to just the critical patterns. For the river models, a crucial <strong>rainfall anomaly</strong> feature is calculated to give the model a clear signal of "wetter than usual" or "drier than usual" months.</p>
          <div className="bg-article-panel border border-article-panel-line border-l-[3px] border-l-article-teal rounded-[10px] p-[18px_20px] my-[22px] text-[15px] text-article-ivory-dim">
            <div className="text-center font-mono text-base text-article-gold pt-1.5 pb-0.5">
              Rainfall Anomaly = (R - R<sub>mean</sub>) / R<sub>mean</sub> × 100
            </div>
            <p className="mt-2.5 text-center text-[13.5px]">This simple formula acts as a powerful amplifier for extreme weather signals.</p>
          </div>
        </ArticleSection>

        <ArticleSection id="results" index="09 — The Scorecard" title="Which model actually won — and why did some fail so badly?">
          <p>For predicting the ocean's ENSO state, one model pulled far ahead of the rest: <strong>XGBoost won clearly</strong>, correctly explaining over 90% of what actually happened in the real world.</p>
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-[11.5px] uppercase tracking-wider text-article-teal font-medium">Model</th>
                  <th className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-[11.5px] uppercase tracking-wider text-article-teal font-medium">MAE</th>
                  <th className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-[11.5px] uppercase tracking-wider text-article-teal font-medium">RMSE</th>
                  <th className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-[11.5px] uppercase tracking-wider text-article-teal font-medium">R²</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line text-article-gold font-semibold">XGBoost</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-article-gold font-semibold">0.354</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-article-gold font-semibold">0.486</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono text-article-gold font-semibold">0.906</td>
                </tr>
                <tr>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line">CNN-LSTM</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.680</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.972</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.486</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>For local river water levels, the best result came from combining two strengths instead of picking just one: a <strong>hybrid XGBoost–LSTM model</strong>, pairing XGBoost's talent for spotting tricky relationships with LSTM's talent for remembering seasonal rhythm, reached <strong>R² up to 0.923</strong> at the best-performing station.</p>
        </ArticleSection>
        
        <ArticleSection id="matters" index="11 — The Human Payoff" title="Why does having twelve months of notice actually matter to real people?">
          <p>A week's warning lets you move your furniture to higher ground. A year's warning lets you change your decisions before they're locked in: choosing a flood-resistant seed variety before planting season instead of after the crop is already in the ground, reinforcing an embankment while it's still dry season, planning an evacuation route ahead of time, or moving community resources into place before a crisis hits.</p>
        </ArticleSection>

        {/* Footer / Glossary simplified for length */}
        <footer className="pt-[60px] pb-[90px] border-t border-article-panel-line mt-12">
          <div className="bg-article-panel border border-article-panel-line rounded-[14px] p-8 mb-12">
            <h3 className="font-article font-semibold text-lg text-article-ivory mb-2">About this research</h3>
            <p className="text-sm text-article-ivory-dim leading-relaxed">
              OceanSense: An AI-Powered ENSO Early Disaster Warning System is a CSE 4098B capstone project at the University of Liberal Arts Bangladesh (ULAB), Spring 2026, by <strong>Faria Islam Sara, Md Maruf Hossain, Rabbi Sadnan Khan,</strong> and <strong>Rakibul Hasan</strong>, under the supervision of <strong>Nasir Uddin Ahmed</strong>.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
