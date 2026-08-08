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

        <ArticleSection id="pipeline" index="07 — From Raw Numbers to Model-Ready Data" title="What actually happens to the data before the AI ever sees it?">
          <p>The raw numbers go through a rigorous pipeline. Time-series are aligned, variables are normalized, and <strong>Principal Component Analysis (PCA)</strong> is used to reduce the massive dimensionality of global climate maps down to just the critical patterns. For the river models, a crucial <strong>rainfall anomaly</strong> feature is calculated to give the model a clear signal of "wetter than usual" or "drier than usual" months.</p>
          <div className="bg-article-panel border border-article-panel-line border-l-[3px] border-l-article-teal rounded-[10px] p-[18px_20px] my-[22px] text-[15px] text-article-ivory-dim">
            <div className="text-center font-mono text-base text-article-gold pt-1.5 pb-0.5">
              Rainfall Anomaly = (R - R<sub>mean</sub>) / R<sub>mean</sub> × 100
            </div>
            <p className="mt-2.5 text-center text-[13.5px]">This simple formula acts as a powerful amplifier for extreme weather signals.</p>
          </div>
          <p className="font-mono text-[12.5px] text-article-ivory-dim">Note: one small technical detail — feature scaling was skipped for XGBoost on purpose, since tree-based models don't care whether a number is "5" or "5,000"; they only care about the order <a href="#ref-shen">(Shen, 2018)</a>.</p>
        </ArticleSection>

        <ArticleSection id="learn" index="08 — Inside the Machine" title="How does the AI actually learn to read the ocean and the rivers?">
          <p>The team didn't just pick one AI method and hope for the best — they put five different "AI brains" through a head-to-head competition for ocean prediction, and ran a similar contest for river prediction. The clear winner, and the one worth actually understanding, was <strong>XGBoost</strong>.</p>
          <p><strong>XGBoost.</strong> Picture hundreds of tiny decision-makers, each one asking one simple question, like "was the temperature above 27°C?" Every decision-maker votes, and all the votes are combined into one final answer. It's especially strong at reading data that's already organized into neat rows and columns, like a spreadsheet <a href="#ref-chen">(T. Chen &amp; Guestrin, 2016)</a>.</p>
          <div className="bg-article-panel border border-article-panel-line border-l-[3px] border-l-article-teal rounded-[10px] p-[18px_20px] my-[22px] text-[15px] text-article-ivory-dim">
            <strong>Every model was graded on the same three-question report card:</strong> <span className="font-mono">MAE</span> (on average, how far off was each guess — like a golf score, lower is better), <span className="font-mono">RMSE</span> (a second error score that punishes a really big miss extra hard — also lower is better), and <span className="font-mono">R²</span> (out of the whole real-world pattern, how much did the model actually explain — like a percentage, higher is better. 1.0 is a perfect score, 0 is no better than always guessing the average, and a negative number means it did worse than that).
          </div>
        </ArticleSection>

        <ArticleSection id="results" index="09 — The Scorecard" title="Which model actually won — and why did some fail so badly?">
          <p>Quick reminder before the numbers: for the first two columns (MAE, RMSE), a <strong>smaller</strong> number is better, like a golf score. For the last column (R²), a <strong>bigger</strong> number is better, like a percentage — 1.0 is a perfect 100%.</p>
          <p>For predicting the ocean's ENSO state, one model pulled far ahead of the rest: <strong>XGBoost won clearly</strong>, correctly explaining over 90% of what actually happened in the real world — like a student scoring 90 on a test where everyone else is stuck around 50 or lower:</p>
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
                <tr>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line">CTEFNet</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.792</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">1.029</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.447</td>
                </tr>
                <tr>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line">LSTM</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.723</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.939</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">-0.262</td>
                </tr>
                <tr>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line">ConvLSTM</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">4.750</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">6.341</td>
                  <td className="text-left py-2.5 px-3 border-b border-article-panel-line font-mono">0.009</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>To put a real number on it: an RMSE of <strong>0.486</strong> here means XGBoost's guesses for the Niño 3.4 index were typically off by less than half a degree Celsius — a tiny margin for something this hard to predict months out.</p>
          <p>The standalone LSTM actually scored <em>below zero</em> — meaning it did worse than a lazy forecaster who just guesses "the average" every single time. The reason is fairly intuitive: ENSO is fundamentally about the whole ocean's shape and geography, and a model with no built-in sense of "where" struggles to represent that <a href="#ref-ham">(Ham et al., 2019)</a>.</p>
          <p>For local <strong>river water levels</strong>, the story flipped a little: <strong>LSTM and XGBoost</strong> both did well here too (R² reaching <strong>0.905</strong> and <strong>0.881</strong> respectively across stations), while the <strong>Graph Neural Networks mostly failed</strong>, scoring below zero. The likely reason is simple: GNNs need a big, richly connected network to learn anything useful, and three stations is a bit like trying to understand a whole city's traffic from just three intersections <a href="#ref-jafarzadegan">(Jafarzadegan et al., 2023)</a>.</p>
          <p>The best result of the entire study came from combining two strengths instead of picking just one: a <strong>hybrid XGBoost–LSTM model</strong>, pairing XGBoost's talent for spotting tricky relationships with LSTM's talent for remembering seasonal rhythm, reached <strong>R² up to 0.923</strong> at the best-performing station — the lowest error of any model tested <a href="#ref-chen">(T. Chen &amp; Guestrin, 2016)</a>.</p>
          <div className="bg-article-panel border border-article-panel-line border-l-[3px] border-l-article-danger rounded-[10px] p-[18px_20px] my-[22px] text-[15px] text-article-ivory-dim">
            <strong className="text-article-ivory">Not every station behaved the same way.</strong> One station consistently scored lower (R² around 0.66) than the other two — a reminder that even the best model is only ever as reliable as the data feeding it, the same way even a great cook can't save a dish made with bad ingredients.
          </div>
        </ArticleSection>

        <ArticleSection id="forecast" index="10 — Looking Ahead" title="What does OceanSense actually predict is coming in 2026?">
          <p>Running the whole pipeline forward, like a weather forecast for the year ahead, the model projects <strong>neutral ENSO conditions</strong> through the coming year — the Niño 3.4 index is expected to stay within the normal, calm range of −0.5 to +0.5. In plain terms: no strong El Niño or La Niña is expected to stir up extreme weather.</p>
          <p>Following that signal all the way downstream, the pipeline forecasts that water levels at Kurigram, Gaibandha, and Jamalpur will <strong>stay below the 22-metre danger line throughout 2026</strong>, following the usual seasonal shape: a gentle rise from January to May, a peak during the core monsoon months of June to September, and a gradual fall back down from October to December — matching the well-known seasonal rhythm of the Brahmaputra–Jamuna basin <a href="#ref-hossain">(Hossain et al., 2019)</a>.</p>
          <p>In short: <strong>moderate flood risk, no extreme flooding expected</strong> — but with one honest caveat. This forecast is only as good as the ENSO projection it starts from, the same way a delivery time estimate is only as good as the traffic report it's based on. If real-world ENSO behaves differently than assumed, that error travels straight down the chain into the rainfall and river-level forecasts.</p>
        </ArticleSection>
        
        <ArticleSection id="matters" index="11 — The Human Payoff" title="Why does having twelve months of notice actually matter to real people?">
          <p>A week's warning lets you move your furniture to higher ground. A year's warning lets you change your decisions before they're locked in: choosing a flood-resistant seed variety before planting season instead of after the crop is already in the ground, reinforcing an embankment while it's still dry season, planning an evacuation route ahead of time, or moving community resources into place before a crisis hits — instead of scrambling after.</p>
          <p>The stakes here are not abstract. Field surveys of Bangladesh's riverine char (river-island) communities have found flood and erosion events causing crop damage above 90% in affected areas, with erosion itself acting as a major long-term driver of displacement <a href="#ref-islam">(Islam, 2017)</a>. Extra lead time is one of the few real levers that can meaningfully shrink that damage before it ever happens.</p>
          <p>At a policy level, this work is a direct contribution to <strong>UN Sustainable Development Goal 13 (Climate Action)</strong>, and indirectly supports <strong>SDG 11 (Sustainable Cities and Communities)</strong> by helping vulnerable riverine communities plan rather than react.</p>
        </ArticleSection>

        <ArticleSection id="limits" index="12 — Being Honest" title="What can't OceanSense do — at least, not yet?">
          <p>No forecasting system is a crystal ball, and the team is upfront about exactly where this one still has rough edges.</p>
          <p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory-dim bg-article-navy-light">Depends on the ENSO input</span> If the starting ocean forecast is wrong, every prediction built on top of it inherits that mistake — like a house built on a shaky foundation. <br/><br/>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory-dim bg-article-navy-light">Only 3 stations</span> Kurigram, Gaibandha, and Jamalpur represent the wider basin well, but they aren't the whole country. <br/><br/>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory-dim bg-article-navy-light">No river physics</span> This is a pattern-recognition system, not a physical simulation of how water actually flows and moves through the land, which can make it less reliable during rare, extreme events <a href="#ref-jafarzadegan">(Jafarzadegan et al., 2023)</a>. <br/><br/>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory-dim bg-article-navy-light">Data gaps</span> Public records sometimes have missing or messy stretches, and gaps like that can quietly bias what the model learns.
          </p>
        </ArticleSection>

        <ArticleSection id="next" index="13 — Where This Goes Next" title="What's the plan for turning this from a research prototype into something people actually use?">
          <p>Turning this from a research project into something a real community can use is planned in three steps, like building a house floor by floor. <strong>Phase 1</strong> is a web dashboard showing ENSO, rainfall, and water-level forecasts, with the flood threshold drawn right on the chart so anyone can see at a glance whether the line is close to being crossed. <strong>Phase 2</strong> is a mobile app, built with Flutter, that works even offline and sends real-time flood alerts straight to someone's phone. <strong>Phase 3</strong> connects everything to live data feeds from NOAA, NASA, and BWDB so the whole pipeline updates itself automatically — turning it into a genuine <strong>Decision Support System</strong> that disaster management authorities can actually rely on.</p>
          <p>The team estimated a full project budget of around <strong>৳725,000</strong> for a four-person team over a year — including computing hardware, cloud costs, data access, and an SMS alert gateway for community dissemination.</p>
        </ArticleSection>

        <ArticleSection id="stack" index="14 — Under the Hood" title="What was OceanSense actually built with?">
          <p>None of this is exotic, secret technology. It's a careful combination of well-known, mostly free and open-source tools — the same kind of building blocks used across the AI and data science world — chosen because they're reliable, not because they're trendy.</p>
          
          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">Languages</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Python</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">JavaScript (React.js)</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">SQL</span>
          </div>
          
          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">Machine Learning & Deep Learning</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">XGBoost</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">PyTorch</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">TensorFlow / Keras</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">PyTorch Geometric (GNNs)</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">scikit-learn</span>
          </div>

          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">Geospatial & Scientific Data Processing</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Xarray</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">NetCDF4</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Pandas</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">NumPy</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">GeoPandas</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Shapely</span>
          </div>

          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">APIs & Data Providers</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Copernicus CDS API</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">NOAA PSL API</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Google Earth Engine</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">BWDB</span>
          </div>

          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">Visualization</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Leaflet.js / Mapbox GL JS</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Matplotlib</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Seaborn</span>
          </div>

          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">Infrastructure & Deployment</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">PostgreSQL + PostGIS</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">AWS S3 / Google Cloud Storage</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Docker</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">FastAPI / Flask</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Twilio SMS Gateway</span>
          </div>

          <div className="mt-5 mb-2">
            <h4 className="font-mono text-[11.5px] uppercase tracking-widest text-article-teal mb-2.5 font-medium">Collaboration & Tracking</h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">GitHub</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">MLflow</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Google Colab Pro</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mr-2 mb-2 border border-article-panel-line text-article-ivory bg-article-navy-light">Overleaf</span>
          </div>
        </ArticleSection>

        <ArticleSection id="glossary" index="15 — Key Terms, Explained Simply" title="What do all these technical words actually mean?">
          <p>A short, plain-English glossary for anyone who wants to skim the jargon without losing the meaning — like a cheat sheet you can keep next to the article.</p>
          <dl className="mt-2">
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">ENSO</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">The El Niño–Southern Oscillation — the natural warming/cooling cycle of the tropical Pacific Ocean that reshapes weather worldwide.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">Niño 3.4 Index</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">The single number scientists use to officially track whether the Pacific is in an El Niño, La Niña, or neutral state.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">Teleconnection</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">A statistical link between weather in one part of the world and weather thousands of kilometres away — like the Pacific and the Bangladesh monsoon.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">Spring Predictability Barrier</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">A well-known seasonal blind spot where ENSO forecasts made in spring become far less reliable than forecasts made at other times of year.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">Lead Time</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">How far in advance a forecast is made — the whole point of OceanSense is stretching this from days to months.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">XGBoost</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">A machine learning method that builds many small decision trees and combines them, especially strong on structured, table-shaped data.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">LSTM</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">A type of neural network with a built-in "memory," designed to understand patterns that unfold over a sequence of time.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">Attention Mechanism</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">A technique that lets a model automatically weigh which past time steps matter most, instead of treating every month equally.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">GNN</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">Graph Neural Network — a model designed to learn from how points (like river stations) are connected to each other, similar to a road map.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">PCA</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">Principal Component Analysis — a way of compressing large, complex data down to its most important patterns, discarding redundant noise.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">R² (R-squared)</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">A score from roughly 0 to 1 showing how much of the real-world pattern a model actually explains. 1.0 is perfect; 0 is no better than guessing the average; negative is worse than that.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">RMSE / MAE</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">Two ways of measuring average prediction error — RMSE punishes big mistakes more harshly, MAE treats every error equally.</dd>
            </div>
            <div className="border-b border-article-panel-line py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-[18px] last:border-b-0">
              <dt className="font-mono text-[13.5px] text-article-gold font-semibold">BWDB</dt>
              <dd className="m-0 text-article-ivory-dim text-[15px]">The Bangladesh Water Development Board — the government body that sets official river danger levels, including the 22m flood threshold used throughout this project.</dd>
            </div>
          </dl>
        </ArticleSection>

        {/* Footer */}
        <footer className="pt-[60px] pb-[90px] border-t border-article-panel-line mt-12" id="refs">
          <div className="bg-article-panel border border-article-panel-line rounded-[14px] p-8 mb-12">
            <h3 className="font-article font-semibold text-[18px] text-article-ivory mb-2 mt-0">About this research</h3>
            <p className="text-[14px] text-article-ivory-dim leading-relaxed">
              OceanSense: An AI-Powered ENSO Early Disaster Warning System is a CSE 4098B capstone project at the University of Liberal Arts Bangladesh (ULAB), Spring 2026, by <strong>Faria Islam Sara, Md Maruf Hossain, Rabbi Sadnan Khan,</strong> and <strong>Rakibul Hasan</strong>, under the supervision of <strong>Nasir Uddin Ahmed</strong>. This article is a plain-language companion to the full capstone report and is not a substitute for it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 mt-[18px] border-t border-article-panel-line pt-4">
              <div className="flex-1 pr-3.5 text-[12.5px] text-article-ivory-dim">
                <span className="font-mono text-[11px] text-article-teal uppercase tracking-widest block mb-1">Fall '25</span>
                Domain selection, problem framing, and the first pass of literature review.
              </div>
              <div className="flex-1 pr-3.5 text-[12.5px] text-article-ivory-dim border-t sm:border-t-0 sm:border-l border-article-panel-line pt-4 sm:pt-0 sm:pl-3.5 mt-4 sm:mt-0">
                <span className="font-mono text-[11px] text-article-teal uppercase tracking-widest block mb-1">Spring '26</span>
                Dataset collection, methodology design, model selection, and prototype development.
              </div>
              <div className="flex-1 pr-3.5 text-[12.5px] text-article-ivory-dim border-t sm:border-t-0 sm:border-l border-article-panel-line pt-4 sm:pt-0 sm:pl-3.5 mt-4 sm:mt-0">
                <span className="font-mono text-[11px] text-article-teal uppercase tracking-widest block mb-1">Summer '26</span>
                Core system build, testing, performance evaluation, and final report writing.
              </div>
            </div>
          </div>

          <h3 className="font-article font-semibold text-[20px] text-article-ivory mb-[18px]">References</h3>
          <ul className="text-[14px] text-article-ivory-dim list-disc pl-5 space-y-2.5">
            <li>Trenberth, K. E. (1997). The definition of El Niño. <em>Bulletin of the American Meteorological Society</em>, 78(12), 2771–2778.</li>
            <li>McPhaden, M. J., Zebiak, S. E., &amp; Glantz, M. H. (2006). ENSO as an integrating concept in earth science. <em>Science</em>, 314(5806), 1740–1745.</li>
            <li>Mohsin, M., Ghosh, T., Akter, F., Sarkar, S., &amp; Mullick, M. R. (2025). Seasonal weather pattern prediction from ENSO indices using machine learning.</li>
            <li>Ehsan, M. A., Tippett, M. K., Robertson, A. W., Singh, B., &amp; Rahman, M. A. (2023). The ENSO fingerprint on Bangladesh summer monsoon rainfall. <em>Earth Systems and Environment</em>, 7(3), 617–627.</li>
            <li>Hossain, S., Cloke, H. L., Fıcchı, A., Turner, A. G., &amp; Stephens, E. (2019). Hydrometeorological drivers of the 2017 flood in the Brahmaputra basin in Bangladesh. <em>Hydrology and Earth System Sciences Discussions</em>.</li>
            <li>Wang, G.-G., Cheng, H., Zhang, Y., &amp; Yu, H. (2023). ENSO analysis and prediction using deep learning: A review. <em>Neurocomputing</em>, 520, 216–229.</li>
            <li>Fang, W., Sha, Y., &amp; Sheng, V. S. (2022). Survey on the application of artificial intelligence in ENSO forecasting. <em>Mathematics</em>, 10(20), 3793.</li>
            <li>Xiaoqun, C., Yanan, G., Bainian, L., Kecheng, P., Guangjie, W., &amp; Mei, G. (2020). ENSO prediction based on long short-term memory (LSTM). <em>IOP Conference Series: Materials Science and Engineering</em>, 799, 012035.</li>
            <li>Chen, T., &amp; Guestrin, C. (2016). XGBoost: A scalable tree boosting system. In <em>Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining</em> (pp. 785–794).</li>
            <li>Hochreiter, S., &amp; Schmidhuber, J. (1997). Long short-term memory. <em>Neural Computation</em>, 9(8), 1735–1780.</li>
            <li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., &amp; Polosukhin, I. (2017). Attention is all you need. <em>Advances in Neural Information Processing Systems</em>, 30.</li>
            <li>Ham, Y.-G., Kim, J.-H., &amp; Luo, J.-J. (2019). Deep learning for multi-year ENSO forecasts. <em>Nature</em>, 573(7775), 568–572.</li>
            <li>Jafarzadegan, K., Moradkhani, H., Pappenberger, F., Moftakhari, H., Bates, P., Abbaszadeh, P., et al. (2023). Recent advances and new frontiers in riverine and coastal flood modeling. <em>Reviews of Geophysics</em>, 61(2), e2022RG000788.</li>
            <li>Islam, S. (2017). Assessment of the impact and management of flood, drought and river bank erosion: A case study of char land peoples of Gangachara Upazila, Rangpur district, Bangladesh. <em>Imperial Journal of Interdisciplinary Research</em>, 3(4), 96–111.</li>
            <li>Shen, C. (2018). A transdisciplinary review of deep learning research and its relevance for water resources scientists. <em>Water Resources Research</em>, 54(11), 8558–8593.</li>
          </ul>
        </footer>

      </main>
    </div>
  );
}
