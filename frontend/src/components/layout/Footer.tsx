import { ExternalLink, FileText, GraduationCap, Mail, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Research', href: '/research' },
    { label: 'AI Pipeline', href: '/#pipeline' },
    { label: 'Dashboard', href: '/dashboard/overview' },
    { label: 'About Us', href: '/about' },
  ];

  const resources = ['Documentation', 'API Reference', 'Publications', 'Datasets', 'GitHub'];

  return (
    <footer className="section-rule bg-[#020b1d]/82 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.55fr_0.65fr_0.8fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Waves className="h-7 w-7 text-accent" />
              <span className="text-xl font-black text-white">OceanSense</span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/58">
              AI-powered ENSO-based flood early warning system for Bangladesh, providing advanced climate intelligence and flood risk assessment.
            </p>
            <div className="mt-5 flex gap-3">
              {[ExternalLink, FileText, GraduationCap, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label="OceanSense social link"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.055] text-white/58 transition-colors hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-white/55 transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black text-white">Resources</h4>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-white/55 transition-colors hover:text-accent">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black text-white">Contact</h4>
            <ul className="space-y-2 text-xs text-white/55">
              <li>University Research Lab</li>
              <li>Bangladesh</li>
              <li>oceansense@research.edu</li>
              <li>+880 1234-567890</li>
            </ul>
          </div>

          <div className="panel-glow rounded-lg border border-white/10 bg-white/[0.055] p-5">
            <h4 className="mb-2 text-sm font-black text-white">Stay Updated</h4>
            <p className="mb-4 text-xs leading-5 text-white/55">
              Get the latest updates on our research and system developments.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-md border border-white/10 bg-[#03152f] px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-accent/50"
              />
              <button
                type="button"
                className="rounded-md bg-accent px-3 py-2 text-xs font-black text-primary transition-colors hover:bg-accent-light"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-9 border-t border-white/10 pt-5 text-center text-xs text-white/42">
          (c) 2026 OceanSense. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
