import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, Waves, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isDashboard = location.pathname.startsWith('/dashboard');

  const navLinks = [
    { to: '/#home', label: 'Home', hash: 'home' },
    { to: '/#research', label: 'Research', hash: 'research' },
    { to: '/#pipeline', label: 'AI Pipeline', hash: 'pipeline' },
    { to: '/dashboard/overview', label: 'Dashboard', hash: '' },
    { to: '/#tech', label: 'Resources', hash: 'tech' },
    { to: '/about', label: 'About', hash: '' },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(isDashboard ? 'dashboard' : 'home');
      return;
    }

    const sectionIds = ['home', 'research', 'pipeline', 'capabilities', 'tech', 'map', 'research-section'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      {
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0.18, 0.3, 0.45],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isDashboard, location.pathname]);

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!hash) return;

    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(hash);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (hash === 'home') {
        window.history.pushState(null, '', '/#home');
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        setMobileMenuOpen(false);
        return;
      }
      if (el) {
        const navOffset = isScrolled ? 64 : 72;
        const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
        window.history.pushState(null, '', `/#${hash}`);
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-colors duration-200 ${isDashboard ? 'hidden' : ''}`}
        animate={{
          y: 0,
          backgroundColor: isScrolled ? 'rgba(3, 21, 47, 0.94)' : 'rgba(3, 21, 47, 0.42)',
          borderColor: isScrolled ? 'rgba(103, 232, 249, 0.18)' : 'rgba(103, 232, 249, 0.08)',
          boxShadow: isScrolled ? '0 12px 36px rgba(0, 0, 0, 0.28)' : '0 0 0 rgba(0, 0, 0, 0)',
        }}
        initial={{ y: -100 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isScrolled ? 'h-14' : 'h-16'}`}>
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.span animate={{ scale: isScrolled ? 0.94 : 1 }} transition={{ duration: 0.2 }} className="flex items-center space-x-2">
              <Waves className="h-7 w-7 text-accent drop-shadow-[0_0_12px_rgba(0,194,255,0.55)]" />
              <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-accent">
                OceanSense
              </span>
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive =
                  link.to === '/dashboard/overview'
                    ? location.pathname.startsWith('/dashboard')
                    : link.to === '/about'
                    ? location.pathname === '/about'
                    : location.pathname === '/' && activeSection === link.hash;

                const cls = `text-xs font-semibold transition-colors duration-200 ${
                  isActive ? 'text-accent' : 'text-white/68 hover:text-white'
                }`;

                // Pure route links (no hash) use Link, hash-scroll links use <a>
                if (!link.hash) {
                  return (
                    <Link key={`${link.to}-${link.label}`} to={link.to} className={cls}>
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={`${link.to}-${link.label}`}
                    href={link.to}
                    onClick={(e) => handleHashLink(e, link.hash)}
                    className={cls}
                  >
                    {link.label}
                  </a>
                );
              })}

              {!isDashboard && (
                <Link
                  to="/dashboard/overview"
                  className="flex items-center gap-2 rounded-md border border-accent/45 bg-accent/10 px-4 py-2 text-xs font-bold text-white shadow-[0_0_22px_rgba(0,194,255,0.18)] transition-all duration-200 hover:bg-accent hover:text-primary hover:shadow-accent/35"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden fixed left-0 right-0 glass-dark border-b border-white/10 z-40 ${isScrolled ? 'top-14' : 'top-16'}`}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={`${link.to}-${link.label}`}
                  href={link.to}
                  onClick={(e) => {
                    handleHashLink(e, link.hash);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {!isDashboard && (
                <Link
                  to="/dashboard/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-accent to-cyan-300 text-primary px-4 py-3 rounded-lg font-semibold text-center text-sm mt-2"
                >
                  Launch Dashboard -&gt;
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
