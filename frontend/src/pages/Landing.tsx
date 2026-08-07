import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import ScienceSection from '../components/landing/ScienceSection';
import BangladeshMap from '../components/landing/BangladeshMap';
import AIPipeline from '../components/landing/AIPipeline';
import TechStack from '../components/landing/TechStack';
import Research from '../components/landing/Research';

import ScrollWaveWrapper from '../components/layout/ScrollWaveWrapper';

/**
 * Section order (per redesign spec):
 * 1. Hero — live station readout right-column
 * 2. BangladeshMap — signature element, promoted high
 * 3. ScienceSection — merged ResearchHighlights + Capabilities, asymmetric layout
 * 4. AIPipeline — flow with real connector line
 * 5. TechStack — explicit responsive grid
 * 6. Research — stat callout + left-icon detail cards
 */
const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ocean-radial">
      <ScrollWaveWrapper>
        <main>
          <Hero />
          <BangladeshMap />
          <ScienceSection />
          <AIPipeline />
          <TechStack />
          <Research />
        </main>
      </ScrollWaveWrapper>
      <Footer />
    </div>
  );
};

export default Landing;
