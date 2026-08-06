import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import ResearchHighlights from '../components/landing/ResearchHighlights';
import AIPipeline from '../components/landing/AIPipeline';
import Capabilities from '../components/landing/Capabilities';
import TechStack from '../components/landing/TechStack';
import BangladeshMap from '../components/landing/BangladeshMap';
import Research from '../components/landing/Research';

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-ocean-radial">
      <main>
        <Hero />
        <ResearchHighlights />
        <AIPipeline />
        <Capabilities />
        <TechStack />
        <BangladeshMap />
        <Research />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
