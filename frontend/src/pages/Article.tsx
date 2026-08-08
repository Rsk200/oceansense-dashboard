import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ArticleSection from '../components/article/ArticleSection';
import ArticleImage from '../components/article/ArticleImage';
import AnimatedGauge from '../components/article/AnimatedGauge';

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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-[#062a5a] text-white selection:bg-accent selection:text-primary pb-16">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/10 overflow-x-auto shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex gap-[22px] py-4 max-w-5xl mx-auto px-6 whitespace-nowrap">
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-white/60 pb-1 border-b-2 border-transparent hover:text-accent hover:border-accent flex items-center transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Home
          </Link>
          <div className="w-px h-4 bg-white/20 my-auto" />
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`font-mono text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 ${
                activeSection === section.id 
                  ? 'text-accent border-accent' 
                  : 'text-white/60 border-transparent hover:text-white hover:border-white/50'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-24 pb-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute -top-[10%] left-[15%] w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent blur-3xl" />
          <div className="absolute top-[10%] left-[80%] -translate-x-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-success/15 to-transparent blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs font-bold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            OceanSense · AI Early Warning Research
          </div>
          
          <motion.h1 
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          >
            Can we see Bangladesh's next <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">big flood</span> — a year before it arrives?
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-14 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          >
            Imagine getting a flood warning a full year in advance — not just a few days. That's the idea behind OceanSense: an AI system that connects ocean temperatures 8,000 km away in the Pacific to river levels in Kurigram, Gaibandha, and Jamalpur.
          </motion.p>

          <div className="max-w-2xl mx-auto mb-16">
            <AnimatedGauge />
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="glass-dark rounded-xl p-6 border border-white/5">
              <span className="font-display font-bold text-4xl text-accent block mb-2">12</span>
              <span className="text-sm text-white/70">months of forecast lead time — instead of days</span>
            </div>
            <div className="glass-dark rounded-xl p-6 border border-white/5">
              <span className="font-display font-bold text-4xl text-accent block mb-2">170M+</span>
              <span className="text-sm text-white/70">people living in Bangladesh's low-lying river delta</span>
            </div>
            <div className="glass-dark rounded-xl p-6 border border-white/5">
              <span className="font-display font-bold text-4xl text-accent block mb-2">18M</span>
              <span className="text-sm text-white/70">people affected by flooding in 2024 alone</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 relative z-10">
        
        <ArticleSection id="why" index="01 — The Problem, In Human Terms" title="Why does Bangladesh need a completely new kind of flood warning?">
          <p>Picture a farmer in Kurigram, watching a rice field that isn't ready to harvest yet. Three enormous rivers — the Ganges, the Brahmaputra, and the Jamuna — all meet in Bangladesh, and more than <strong>170 million people</strong> live on land so flat that a single bad flood can wipe out a whole season's income overnight. In <strong>2024 alone, flooding affected roughly 18 million people and caused over one billion US dollars in damage.</strong></p>
          <p>Today, most flood warnings arrive only a <strong>few days to a week</strong> before the water actually rises. That's enough time to move a bicycle or a cow to higher ground — but nowhere near enough time to plant a flood-resistant crop instead, or reinforce a mud embankment while the ground is still dry. It's a bit like finding out about an important exam the night before, instead of getting a whole semester to prepare for it.</p>
          <p>OceanSense started with one simple question: <em className="text-accent not-italic font-medium">what if the ocean itself could warn us, months in advance, that a flood is coming?</em></p>
        </ArticleSection>

        <ArticleSection id="enso" index="02 — The Ocean Signal" title="What is ENSO, and why should a farmer in Kurigram care about the Pacific Ocean?">
          <p>Think of the tropical Pacific Ocean as a giant bathtub. Every two to seven years, the water in that bathtub swings between running a little warmer than usual (scientists call this <strong>El Niño</strong>) and a little cooler than usual (<strong>La Niña</strong>). This whole back-and-forth swing has a name: <strong>ENSO</strong>, short for the <strong>El Niño–Southern Oscillation</strong>. Scientists track it with one simple number, the <strong>Niño 3.4 index</strong> — the same way a doctor tracks your health with one number on a thermometer.</p>
          <p>Here's why a farmer 8,000 km away should care: this ocean temperature swing doesn't stay in the water. Like a stone dropped into a pond sends ripples all the way to the far shore, a warmer or cooler Pacific sends ripples through wind patterns, air pressure, and rainfall all across the planet. Scientists call this a <strong>teleconnection</strong> — literally, a "connection from far away." South Asia's monsoon, the rainy season that fills up Bangladesh's rivers, turns out to be one of the systems that feels this ripple the most.</p>
          <div className="mt-8 mb-4">
            <ArticleImage src="/article/1.png" alt="Map showing ENSO teleconnections" />
          </div>
        </ArticleSection>

        <ArticleSection id="link" index="03 — The Chain Reaction" title="How exactly does a warmer Pacific Ocean end up flooding a river 8,000 km away?">
          <p>Think of it like four dominoes standing in a row, each one knocking over the next. <strong>Domino 1:</strong> the Pacific Ocean's surface temperature shifts into an El Niño or La Niña state. <strong>Domino 2:</strong> that shift changes the big wind and pressure patterns blowing across Asia. <strong>Domino 3:</strong> those changed winds change how much rain falls over the Himalayan foothills and the Brahmaputra basin during monsoon season. <strong>Domino 4:</strong> that rainfall, combined with melting snow and water flowing in from upstream, decides how high the rivers rise inside Bangladesh.</p>
          <p>This last domino is well documented. The severe 2017 Brahmaputra flood, for example, happened mainly because of an unusually high number of intense rainfall bursts feeding straight into the river system. Studies focused specifically on Bangladesh confirm that ENSO really does act as an early signal for monsoon rainfall here.</p>
          <p>But it isn't a perfectly predictable row of dominoes — sometimes one wobbles instead of falling cleanly, and the whole chain gets noisier or weaker over time. That's exactly why OceanSense can't just "predict the ocean" and call it done. It has to walk the entire chain, one domino at a time.</p>
          <div className="mt-8 mb-4">
            <ArticleImage src="/article/2.png" alt="Chain reaction infographic" />
          </div>
        </ArticleSection>

        <ArticleSection id="problem" index="04 — Why Existing Systems Fall Short" title="If scientists already know ENSO affects Bangladesh, why isn't this solved already?">
          <p>Three gaps keep showing up, again and again, in the research. <strong>Gap 1:</strong> seasonal climate forecasts are often either not accurate enough, or don't give enough advance warning, for real disaster planning. <strong>Gap 2:</strong> there's a missing translator between <em>global</em> ocean forecasts and <em>local</em> river conditions — almost nobody connects the two. It's a bit like having a weather report for the whole planet, but nothing that tells you whether to carry an umbrella on your own street. <strong>Gap 3:</strong> even when a solid forecast exists, there's rarely a simple system that turns it into a plain warning a community can actually act on.</p>
          <p>There's also a modeling problem underneath all this. Older statistical methods (like ARIMA, a classic forecasting formula) are too rigid to capture how messy and unpredictable ocean-atmosphere behaviour really is. Even modern forecasts hit a well-known wall called the <strong>Spring Predictability Barrier</strong> — think of it as a seasonal "fog" during which ENSO forecasts made in spring become far less trustworthy, the same way a weather app struggles more on a day when the sky keeps changing its mind.</p>
        </ArticleSection>

        <ArticleSection id="what" index="05 — Meet the System" title="So, in plain terms — what actually is OceanSense?">
          <p>In plain terms, OceanSense is three "helpers" working together like a relay race, where each runner hands the baton to the next:</p>
          <ul className="space-y-4 my-6 list-none pl-0">
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold shrink-0">1</span>
              <div><strong>Helper 1 — Watches the ocean.</strong> Looks at global sea surface temperature, wind, and pressure, and predicts what state ENSO will be in.</div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold shrink-0">2</span>
              <div><strong>Helper 2 — Listens to the rivers.</strong> Takes local rainfall, soil moisture, and Helper 1's ENSO prediction, and estimates how high the water will get at specific river stations.</div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold shrink-0">3</span>
              <div><strong>Helper 3 — Connects the dots.</strong> Runs the full relay: ENSO forecast → rainfall forecast → river-level forecast, looking as far as <strong>12 months</strong> ahead. The moment a station's predicted water level reaches or crosses <strong>22 metres</strong> — the official danger line set by the Bangladesh Water Development Board for the Brahmaputra–Jamuna basin — the system raises a flood-risk flag.</div>
            </li>
          </ul>
          <div className="mt-8 mb-4">
            <ArticleImage src="/article/3.png" alt="OceanSense system diagram" />
          </div>
        </ArticleSection>

        <ArticleSection id="data" index="06 — The Raw Material" title="Where does OceanSense actually get its information?">
          <p>Any AI model is only as good as what you feed it — a recipe is only as good as its ingredients. OceanSense uses two "ingredient baskets," both from public, trustworthy sources, not anything private or made up.</p>
          <p><strong>Basket 1 — the ocean's vital signs.</strong> Sea surface temperature, wind stress, air pressure, and ocean heat, pulled from the Copernicus Climate Data Store's ORAS5 ocean reanalysis and NOAA, with monthly records stretching from <strong>2006 to 2025</strong>. Think of this basket as the ocean's medical chart.</p>
          <p><strong>Basket 2 — the rivers' vital signs.</strong> River water level, rainfall, and soil moisture, collected from the Bangladesh Water Development Board (BWDB) and NASA POWER, for three flood-prone spots along the Brahmaputra–Jamuna basin: <strong>Kurigram, Gaibandha, and Jamalpur</strong>. These three were picked because they're among the places that flood most consistently, year after year.</p>
          
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-5 my-6 text-sm text-white/80">
            <strong className="text-warning block mb-1">Why only three stations?</strong> 
            Long, unbroken, twenty-year water-level records are surprisingly hard to find — and for these stations, much of the BWDB data had to be pulled together by hand, page by page. It's a real limitation, and the team is upfront about it (see "Limits," below).
          </div>
          
          <div className="mt-8 mb-4">
            <ArticleImage src="/article/4.png" alt="Map of Bangladesh river stations" />
          </div>
        </ArticleSection>

        <ArticleSection id="pipeline" index="07 — From Raw Numbers to Model-Ready Data" title="What actually happens to the data before the AI ever sees it?">
          <p>The raw numbers go through a rigorous pipeline. Time-series are aligned, variables are normalized, and <strong>Principal Component Analysis (PCA)</strong> is used to reduce the massive dimensionality of global climate maps down to just the critical patterns. For the river models, a crucial <strong>rainfall anomaly</strong> feature is calculated to give the model a clear signal of "wetter than usual" or "drier than usual" months.</p>
          
          <div className="glass-dark border border-accent/20 rounded-xl p-6 my-8 text-center">
            <div className="font-mono text-lg text-accent font-bold mb-3">
              Rainfall Anomaly = (R - R<sub>mean</sub>) / R<sub>mean</sub> × 100
            </div>
            <p className="text-sm text-white/60 mb-0">This simple formula acts as a powerful amplifier for extreme weather signals.</p>
          </div>
          
          <p className="text-sm text-white/50 italic">Note: one small technical detail — feature scaling was skipped for XGBoost on purpose, since tree-based models don't care whether a number is "5" or "5,000"; they only care about the order.</p>
        </ArticleSection>

        <ArticleSection id="learn" index="08 — Inside the Machine" title="How does the AI actually learn to read the ocean and the rivers?">
          <p>The team didn't just pick one AI method and hope for the best — they put five different "AI brains" through a head-to-head competition for ocean prediction, and ran a similar contest for river prediction. The clear winner, and the one worth actually understanding, was <strong>XGBoost</strong>.</p>
          <p><strong>XGBoost.</strong> Picture hundreds of tiny decision-makers, each one asking one simple question, like "was the temperature above 27°C?" Every decision-maker votes, and all the votes are combined into one final answer. It's especially strong at reading data that's already organized into neat rows and columns, like a spreadsheet.</p>
          
          <div className="glass border border-white/10 rounded-xl p-5 my-6 text-sm text-white/70">
            <strong className="text-white">Every model was graded on the same three-question report card:</strong> <br/>
            <span className="text-accent font-mono">MAE</span> (on average, how far off was each guess — like a golf score, lower is better)<br/>
            <span className="text-accent font-mono">RMSE</span> (a second error score that punishes a really big miss extra hard — also lower is better)<br/>
            <span className="text-accent font-mono">R²</span> (out of the whole real-world pattern, how much did the model actually explain — 1.0 is a perfect score).
          </div>
        </ArticleSection>

        <ArticleSection id="results" index="09 — The Scorecard" title="Which model actually won — and why did some fail so badly?">
          <p>For predicting the ocean's ENSO state, one model pulled far ahead of the rest: <strong>XGBoost won clearly</strong>, correctly explaining over 90% of what actually happened in the real world — like a student scoring 90 on a test where everyone else is stuck around 50 or lower:</p>
          
          <div className="overflow-x-auto my-8 rounded-xl border border-white/10 bg-black/20">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 font-mono text-accent uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Model</th>
                  <th className="px-6 py-4 font-medium">MAE</th>
                  <th className="px-6 py-4 font-medium">RMSE</th>
                  <th className="px-6 py-4 font-medium">R²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="bg-accent/5">
                  <td className="px-6 py-4 text-accent font-bold">XGBoost</td>
                  <td className="px-6 py-4 font-mono text-accent">0.354</td>
                  <td className="px-6 py-4 font-mono text-accent">0.486</td>
                  <td className="px-6 py-4 font-mono text-accent">0.906</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">CNN-LSTM</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.680</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.972</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.486</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">CTEFNet</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.792</td>
                  <td className="px-6 py-4 font-mono text-white/70">1.029</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.447</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">LSTM</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.723</td>
                  <td className="px-6 py-4 font-mono text-white/70">0.939</td>
                  <td className="px-6 py-4 font-mono text-danger">-0.262</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p>To put a real number on it: an RMSE of <strong>0.486</strong> here means XGBoost's guesses for the Niño 3.4 index were typically off by less than half a degree Celsius — a tiny margin for something this hard to predict months out.</p>
          <p>The standalone LSTM actually scored <em>below zero</em> — meaning it did worse than a lazy forecaster who just guesses "the average" every single time. The reason is fairly intuitive: ENSO is fundamentally about the whole ocean's shape and geography, and a model with no built-in sense of "where" struggles to represent that.</p>
          <p>For local <strong>river water levels</strong>, the story flipped a little: <strong>LSTM and XGBoost</strong> both did well here too (R² reaching <strong>0.905</strong> and <strong>0.881</strong> respectively across stations), while the <strong>Graph Neural Networks mostly failed</strong>, scoring below zero. The likely reason is simple: GNNs need a big, richly connected network to learn anything useful, and three stations is a bit like trying to understand a whole city's traffic from just three intersections.</p>
          <p>The best result of the entire study came from combining two strengths instead of picking just one: a <strong>hybrid XGBoost–LSTM model</strong>, pairing XGBoost's talent for spotting tricky relationships with LSTM's talent for remembering seasonal rhythm, reached <strong>R² up to 0.923</strong> at the best-performing station — the lowest error of any model tested.</p>
          
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-5 my-6 text-sm text-white/80">
            <strong className="text-danger block mb-1">Not every station behaved the same way.</strong> 
            One station consistently scored lower (R² around 0.66) than the other two — a reminder that even the best model is only ever as reliable as the data feeding it, the same way even a great cook can't save a dish made with bad ingredients.
          </div>
        </ArticleSection>

        <ArticleSection id="forecast" index="10 — Looking Ahead" title="What does OceanSense actually predict is coming in 2026?">
          <p>Running the whole pipeline forward, like a weather forecast for the year ahead, the model projects <strong>neutral ENSO conditions</strong> through the coming year — the Niño 3.4 index is expected to stay within the normal, calm range of −0.5 to +0.5. In plain terms: no strong El Niño or La Niña is expected to stir up extreme weather.</p>
          <p>Following that signal all the way downstream, the pipeline forecasts that water levels at Kurigram, Gaibandha, and Jamalpur will <strong>stay below the 22-metre danger line throughout 2026</strong>, following the usual seasonal shape: a gentle rise from January to May, a peak during the core monsoon months of June to September, and a gradual fall back down from October to December — matching the well-known seasonal rhythm of the Brahmaputra–Jamuna basin.</p>
          <p>In short: <strong className="text-success">moderate flood risk, no extreme flooding expected</strong> — but with one honest caveat. This forecast is only as good as the ENSO projection it starts from, the same way a delivery time estimate is only as good as the traffic report it's based on. If real-world ENSO behaves differently than assumed, that error travels straight down the chain into the rainfall and river-level forecasts.</p>
        </ArticleSection>
        
        <ArticleSection id="matters" index="11 — The Human Payoff" title="Why does having twelve months of notice actually matter to real people?">
          <p>A week's warning lets you move your furniture to higher ground. A year's warning lets you change your decisions before they're locked in: choosing a flood-resistant seed variety before planting season instead of after the crop is already in the ground, reinforcing an embankment while it's still dry season, planning an evacuation route ahead of time, or moving community resources into place before a crisis hits — instead of scrambling after.</p>
          <p>The stakes here are not abstract. Field surveys of Bangladesh's riverine char (river-island) communities have found flood and erosion events causing crop damage above 90% in affected areas, with erosion itself acting as a major long-term driver of displacement. Extra lead time is one of the few real levers that can meaningfully shrink that damage before it ever happens.</p>
          <p>At a policy level, this work is a direct contribution to <strong>UN Sustainable Development Goal 13 (Climate Action)</strong>, and indirectly supports <strong>SDG 11 (Sustainable Cities and Communities)</strong> by helping vulnerable riverine communities plan rather than react.</p>
        </ArticleSection>

        <ArticleSection id="limits" index="12 — Being Honest" title="What can't OceanSense do — at least, not yet?">
          <p>No forecasting system is a crystal ball, and the team is upfront about exactly where this one still has rough edges.</p>
          <ul className="space-y-4 my-6 list-none pl-0">
            <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 whitespace-nowrap text-white/80">Depends on ENSO</span>
              <span className="text-sm">If the starting ocean forecast is wrong, every prediction built on top of it inherits that mistake.</span>
            </li>
            <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 whitespace-nowrap text-white/80">Only 3 stations</span>
              <span className="text-sm">Kurigram, Gaibandha, and Jamalpur represent the wider basin well, but they aren't the whole country.</span>
            </li>
            <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 whitespace-nowrap text-white/80">No river physics</span>
              <span className="text-sm">This is a pattern-recognition system, not a physical simulation of how water actually flows.</span>
            </li>
            <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 whitespace-nowrap text-white/80">Data gaps</span>
              <span className="text-sm">Public records sometimes have missing or messy stretches, which can quietly bias the model.</span>
            </li>
          </ul>
        </ArticleSection>

        <ArticleSection id="next" index="13 — Where This Goes Next" title="What's the plan for turning this from a research prototype into something people actually use?">
          <p>Turning this from a research project into something a real community can use is planned in three steps. <strong>Phase 1</strong> is a web dashboard showing ENSO, rainfall, and water-level forecasts, with the flood threshold drawn right on the chart. <strong>Phase 2</strong> is a mobile app, built with Flutter, that works even offline and sends real-time flood alerts straight to someone's phone. <strong>Phase 3</strong> connects everything to live data feeds from NOAA, NASA, and BWDB so the whole pipeline updates itself automatically — turning it into a genuine <strong>Decision Support System</strong>.</p>
        </ArticleSection>

        <ArticleSection id="stack" index="14 — Under the Hood" title="What was OceanSense actually built with?">
          <p>None of this is exotic, secret technology. It's a careful combination of well-known, mostly free and open-source tools chosen because they're reliable, not because they're trendy.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-3 font-bold">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript (React.js)', 'SQL'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-md text-xs font-mono border border-white/10 bg-white/5 text-white/90">{t}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-3 font-bold">ML & Deep Learning</h4>
              <div className="flex flex-wrap gap-2">
                {['XGBoost', 'PyTorch', 'TensorFlow', 'scikit-learn'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-md text-xs font-mono border border-white/10 bg-white/5 text-white/90">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-3 font-bold">Data Processing</h4>
              <div className="flex flex-wrap gap-2">
                {['Pandas', 'NumPy', 'GeoPandas', 'Xarray'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-md text-xs font-mono border border-white/10 bg-white/5 text-white/90">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-3 font-bold">Infrastructure</h4>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'Docker', 'FastAPI', 'AWS'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-md text-xs font-mono border border-white/10 bg-white/5 text-white/90">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection id="glossary" index="15 — Key Terms, Explained Simply" title="What do all these technical words actually mean?">
          <div className="space-y-4">
            {[
              { term: 'ENSO', def: 'The natural warming/cooling cycle of the tropical Pacific Ocean that reshapes weather worldwide.' },
              { term: 'Niño 3.4 Index', def: 'The single number scientists use to officially track whether the Pacific is in an El Niño, La Niña, or neutral state.' },
              { term: 'Teleconnection', def: 'A statistical link between weather in one part of the world and weather thousands of kilometres away.' },
              { term: 'XGBoost', def: 'A machine learning method that builds many small decision trees and combines them.' },
              { term: 'LSTM', def: 'A type of neural network with a built-in "memory," designed to understand patterns over time.' },
              { term: 'PCA', def: 'A way of compressing large, complex data down to its most important patterns, discarding noise.' },
              { term: 'BWDB', def: 'The Bangladesh Water Development Board — the government body that sets official river danger levels.' }
            ].map(item => (
              <div key={item.term} className="border-b border-white/10 pb-4 last:border-b-0">
                <dt className="font-mono text-sm text-accent font-bold mb-1">{item.term}</dt>
                <dd className="text-sm text-white/70">{item.def}</dd>
              </div>
            ))}
          </div>
        </ArticleSection>

        {/* Footer */}
        <footer className="mt-16 pt-16 border-t border-white/10 pb-20">
          <div className="glass-dark border border-white/10 rounded-2xl p-8 mb-12">
            <h3 className="font-display font-bold text-xl text-white mb-4 mt-0">About this research</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              OceanSense: An AI-Powered ENSO Early Disaster Warning System is a CSE 4098B capstone project at the University of Liberal Arts Bangladesh (ULAB), Spring 2026, by <strong>Faria Islam Sara, Md Maruf Hossain, Rabbi Sadnan Khan,</strong> and <strong>Rakibul Hasan</strong>, under the supervision of <strong>Nasir Uddin Ahmed</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-2 font-bold">Fall '25</span>
                <p className="text-xs text-white/60">Domain selection, problem framing, and literature review.</p>
              </div>
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-2 font-bold">Spring '26</span>
                <p className="text-xs text-white/60">Dataset collection, methodology design, and prototype.</p>
              </div>
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-2 font-bold">Summer '26</span>
                <p className="text-xs text-white/60">Core system build, testing, and final report writing.</p>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
