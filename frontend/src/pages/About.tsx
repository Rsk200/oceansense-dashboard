import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Cpu, Users, Award,
  Mail, Waves, FlaskConical, Star
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── LinkedIn SVG (official brand icon) ────────────────── */
const LinkedInIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ─── Types ─────────────────────────────────────────────── */
interface Person {
  name: string;
  title: string;
  degree: string;
  role: string;
  bio: string;
  skills: string[];
  photo: string;
  linkedin: string;
  email?: string;
}

/* ─── Data ───────────────────────────────────────────────── */
const SUPERVISOR: Person = {
  name: 'Nasir Uddin Ahmed',
  title: 'Lecturer, Dept. of CSE — University of Liberal Arts Bangladesh',
  degree: 'MSc Data Science (Distinction), Universiti Malaya  ·  BSc CSE (Magna Cum Laude), United International University',
  role: 'Research Supervisor & AI/ML Architecture Lead',
  bio: 'Specializes in NLP, deep learning, and large-scale data processing with Apache Spark. Industry experience as Co-founder & CTO of Hadodo IT Ltd., leading ESG-focused digital innovation and Industry 4.0 research.',
  skills: ['Python', 'Deep Learning', 'NLP / BERT', 'Apache Spark', 'Data Science'],
  photo: '/team/supervisor.jpeg',
  linkedin: 'https://www.linkedin.com/in/nasir-uddin-ahmed-184469137/',
};

const MEMBERS: Person[] = [
  {
    name: 'Rakibul Hasan',
    title: 'BSc in CSE (Ongoing) · ULAB',
    degree: '',
    role: 'Backend & Data Pipeline Engineer',
    bio: 'Architected the real-time hydrological data ingestion pipeline across 3 monitoring stations. Implemented flood-risk scoring APIs and OOP-based backend modules powering the core prediction engine.',
    skills: ['Python', 'FastAPI', 'OOP', 'REST APIs'],
    photo: '/team/member1.jpeg',
    linkedin: 'https://www.linkedin.com/in/rakibul-hasan20/',
  },
  {
    name: 'Rabbi Sadnan Khan',
    title: 'BSc in CSE (Ongoing) · ULAB',
    degree: '',
    role: 'Full-Stack & Dashboard Lead',
    bio: 'Built the production React/TypeScript dashboard with real-time risk visualization and live ENSO forecast integration. Owns the full frontend architecture, UI/UX design, and Vercel deployment pipeline.',
    skills: ['React', 'TypeScript', 'FastAPI', 'Framer Motion'],
    photo: '/team/member2.jpg',
    linkedin: 'https://www.linkedin.com/in/rabbisadnan26/',
  },
  {
    name: 'Faria Islam Sara',
    title: 'BSc in CSE (Final Year) · ULAB',
    degree: '',
    role: 'ML Engineer & Climate Data Analyst',
    bio: 'Designed and trained 6+ ML models for ENSO-based flood prediction using NASA and NOAA climate datasets. Led data preprocessing pipelines and model evaluation with Django backend integration.',
    skills: ['Python', 'Machine Learning', 'Django', 'MongoDB'],
    photo: '/team/member3.jpeg',
    linkedin: 'https://www.linkedin.com/in/faria-islam-sara-73ab0b409/',
  },
  {
    name: 'Maruf Hossain',
    title: 'BSc in CSE (Ongoing) · ULAB',
    degree: '',
    role: 'AI/ML Engineer & Research Lead',
    bio: 'Developed XGBoost and LSTM models for long-range flood forecasting in Bangladesh. Led research paper authorship, AI benchmarking, and ML inference integration into the OceanSense production API.',
    skills: ['Python', 'XGBoost', 'LSTM', 'Data Science'],
    photo: '/team/member4.jpg',
    linkedin: 'https://www.linkedin.com/in/maruf-hossain-9055b12a1/',
  },
];

/* ─── Skill Tag ──────────────────────────────────────────── */
const Tag = ({ label }: { label: string }) => (
  <motion.span
    whileHover={{ filter: 'brightness(1.3)', scale: 1.04 }}
    transition={{ duration: 0.15 }}
    className="inline-flex items-center px-3 py-[5px] rounded-md text-[11px] font-bold
      bg-[#00d4ff10] text-[#00d4ff] border border-[#00d4ff22] tracking-wide cursor-default select-none"
  >
    {label}
  </motion.span>
);

/* ─── Section Divider ────────────────────────────────────── */
const SectionLabel = ({
  icon: Icon, label, sub,
}: { icon: React.ElementType; label: string; sub?: string }) => (
  <div className="relative flex items-center gap-5 mb-12">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00d4ff28] to-transparent" />
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full
        bg-[#00d4ff0d] border border-[#00d4ff22] shadow-[0_0_20px_rgba(0,212,255,0.07)]">
        <Icon className="w-3.5 h-3.5 text-[#00d4ff]" />
        <span className="text-[#00d4ff] text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
      </div>
      {sub && <p className="text-[#94a3b8] text-[11px] text-center mt-1">{sub}</p>}
    </div>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00d4ff28] to-transparent" />
  </div>
);

/* ─── Stats Banner ───────────────────────────────────────── */
const STATS = [
  { icon: Users,       value: '4 + 1', label: 'Team Members',             suffix: '' },
  { icon: Cpu,         value: '6',     label: 'AI Models Trained',         suffix: '+' },
  { icon: Waves,       value: '3',     label: 'Monitoring Stations',       suffix: '' },
  { icon: Award,       value: '1',     label: 'Research Paper Submitted',  suffix: '' },
];

const StatsBanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
    >
      {STATS.map(({ icon: Icon, value, label, suffix }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ translateY: -5, boxShadow: '0 12px 36px rgba(0,212,255,0.14)' }}
          className="rounded-2xl p-6 text-center border border-[#00d4ff14]
            bg-gradient-to-b from-[#0f2040] to-[#0a1628]
            shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-default"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl
            bg-[#00d4ff0f] border border-[#00d4ff18] mb-3">
            <Icon className="w-5 h-5 text-[#00d4ff]" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1 tracking-tight leading-none">
            {value}<span className="text-[#00d4ff]">{suffix}</span>
          </div>
          <div className="text-[#94a3b8] text-[11px] uppercase tracking-[0.1em] font-medium">{label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ─── Supervisor Card ────────────────────────────────────── */
const SupervisorCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative rounded-2xl overflow-hidden border border-[#00d4ff30]
        shadow-[0_0_60px_rgba(0,212,255,0.08),0_4px_40px_rgba(0,0,0,0.4)]"
      style={{ background: 'linear-gradient(135deg, #0d2045 0%, #0c1a38 50%, #080f20 100%)' }}
    >
      {/* Top glow bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]
        bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, #00d4ff 0%, transparent 50%)',
        }} />

      {/* Supervisor badge top-right */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5
        rounded-full bg-[#00d4ff12] border border-[#00d4ff28]
        text-[#00d4ff] text-[10px] font-bold uppercase tracking-[0.12em]">
        <Star className="w-3 h-3" />
        Project Supervisor
      </div>

      <div className="relative p-10 md:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Photo — large */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-2 rounded-full bg-[#00d4ff18] blur-xl" />
              <div className="absolute -inset-1 rounded-full border-2 border-[#00d4ff30]" />
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#00d4ff45]
                shadow-[0_0_40px_rgba(0,212,255,0.25)] relative z-10">
                <img src={SUPERVISOR.photo} alt={SUPERVISOR.name}
                  className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* LinkedIn under photo */}
            <a href={SUPERVISOR.linkedin} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold
                bg-[#0077b515] border border-[#0077b535] text-[#38bdf8]
                hover:bg-[#0077b525] hover:border-[#0077b555]
                hover:text-white transition-all duration-200 shadow-sm"
              title="LinkedIn Profile">
              <LinkedInIcon className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Role */}
            <p className="text-[#00d4ff] text-[11px] font-bold uppercase tracking-[0.14em] mb-3 font-mono">
              {SUPERVISOR.role}
            </p>

            {/* Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 leading-tight">
              {SUPERVISOR.name}
            </h2>

            {/* Title */}
            <p className="text-[#94a3b8] text-sm mb-4">{SUPERVISOR.title}</p>

            {/* Degrees */}
            <div className="flex items-start gap-2.5 mb-5 p-3 rounded-xl
              bg-[#00d4ff06] border border-[#00d4ff10]">
              <GraduationCap className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
              <p className="text-[#94a3b8] text-sm leading-relaxed">{SUPERVISOR.degree}</p>
            </div>

            {/* Bio */}
            <p className="text-white/75 text-[15px] leading-relaxed mb-6">
              {SUPERVISOR.bio}
            </p>

            {/* Divider */}
            <div className="h-px bg-[#00d4ff10] mb-5" />

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {SUPERVISOR.skills.map(s => <Tag key={s} label={s} />)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Member Card ────────────────────────────────────────── */
const MemberCard = ({ person, index }: { person: Person; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ translateY: -5, boxShadow: '0 20px 50px rgba(0,212,255,0.1)' }}
      className="group relative rounded-2xl border border-[#ffffff0c]
        hover:border-[#00d4ff25] transition-all duration-300 flex flex-col overflow-hidden
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
      style={{ background: 'linear-gradient(160deg, #0f1e36 0%, #0a1424 100%)' }}
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent
        opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

      <div className="p-7 flex flex-col gap-5 flex-1">

        {/* Header: Photo + Name block */}
        <div className="flex items-center gap-5">
          {/* Photo — larger */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#00d4ff15] blur-md
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-125" />
            <div className="w-20 h-20 rounded-full overflow-hidden relative z-10
              border-2 border-[#ffffff14] group-hover:border-[#00d4ff38]
              shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-colors duration-300">
              <img src={person.photo} alt={person.name}
                className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Name + title + LinkedIn */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-[19px] font-bold text-white tracking-tight leading-none">
                {person.name}
              </h3>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                title="View LinkedIn Profile"
                className="flex-shrink-0 p-1.5 rounded-lg
                  bg-[#0077b510] border border-[#0077b528] text-[#38bdf8]
                  hover:bg-[#0077b520] hover:border-[#0077b548]
                  hover:text-white transition-all duration-200"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
              {person.email && (
                <a href={`mailto:${person.email}`} title="Send Email"
                  className="flex-shrink-0 p-1.5 rounded-lg
                    bg-white/5 border border-white/10 text-[#94a3b8]
                    hover:text-white hover:border-white/20 transition-all duration-200">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-[#94a3b8] text-xs">{person.title}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#ffffff08] group-hover:bg-[#00d4ff12] transition-colors duration-300" />

        {/* Role */}
        <div>
          <p className="text-[#00d4ff] text-[10px] font-bold uppercase tracking-[0.14em] mb-3 font-mono">
            {person.role}
          </p>

          {/* Bio */}
          <p className="text-[#b0bec5] text-sm leading-relaxed">
            {person.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-[#ffffff07]">
          {person.skills.map(s => <Tag key={s} label={s} />)}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Affiliation Section ────────────────────────────────── */
const AffiliationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const tags = ['Capstone Project', 'AI/ML Research', 'Climate Tech', 'Bangladesh', 'Flood Warning System'];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl border border-[#ffffff0a] overflow-hidden
        shadow-[0_4px_32px_rgba(0,0,0,0.35)]"
      style={{ background: 'linear-gradient(135deg, #0e1d35 0%, #0a1628 100%)' }}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1
        bg-gradient-to-r from-transparent via-[#00d4ff60] to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl
        bg-[#00d4ff08] pointer-events-none" />

      <div className="relative p-10 md:p-14 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
          bg-[#00d4ff0f] border border-[#00d4ff20]
          shadow-[0_0_24px_rgba(0,212,255,0.12)]">
          <GraduationCap className="w-8 h-8 text-[#00d4ff]" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          University of Liberal Arts Bangladesh
        </h3>
        <p className="text-[#00d4ff] text-sm font-bold mb-1 tracking-wider uppercase">
          Department of Computer Science & Engineering
        </p>
        <p className="text-[#94a3b8] text-sm mb-2 font-mono">Dhaka, Bangladesh</p>

        <div className="w-16 h-px bg-[#00d4ff30] mx-auto mb-6" />

        <p className="text-[#94a3b8] text-sm max-w-lg mx-auto leading-relaxed mb-8">
          Capstone Project combining academic research, AI/ML engineering, and real-world hydrological climate data to deliver a production-grade flood early warning system for Bangladesh.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          {tags.map(tag => (
            <span key={tag}
              className="px-4 py-2 rounded-full text-xs font-semibold
                bg-[#ffffff07] border border-[#ffffff10] text-[#94a3b8]
                hover:text-white hover:border-[#ffffff20] transition-colors duration-200 cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const About = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#071220' }}>
      <Navbar />

      <main className="pt-28 pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* ── Hero ── */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 28 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-7
                bg-[#00d4ff0d] border border-[#00d4ff20]
                text-[#00d4ff] text-[11px] font-bold uppercase tracking-[0.14em]"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Capstone Research Project · ULAB
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              The Team Behind{' '}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #67e8f9, #00d4ff)' }}>
                OceanSense
              </span>
            </h1>

            <p className="text-[#94a3b8] max-w-2xl mx-auto text-[16px] leading-relaxed">
              An AI-powered flood early warning system for Bangladesh — built at ULAB using machine learning,
              ENSO climate indices, and real-time hydrological data from 3 monitoring stations.
            </p>
          </motion.div>

          {/* ── Stats ── */}
          <StatsBanner />

          {/* ── Supervisor ── */}
          <SectionLabel
            icon={Star}
            label="Project Supervisor"
            sub="Faculty mentor and AI/ML research lead for the OceanSense project"
          />
          <div className="mb-16">
            <SupervisorCard />
          </div>

          {/* ── Team ── */}
          <SectionLabel
            icon={Users}
            label="Core Development Team"
            sub="4 engineers responsible for the full-stack AI platform"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {MEMBERS.map((m, i) => (
              <MemberCard key={m.name} person={m} index={i} />
            ))}
          </div>

          {/* ── Affiliation ── */}
          <AffiliationSection />

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
