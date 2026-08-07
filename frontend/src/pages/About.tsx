import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Cpu, Users, Award,
  Mail, Waves, FlaskConical
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── LinkedIn SVG Icon (original brand icon) ───────────── */
const LinkedInIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
  title: 'Lecturer, Dept. of CSE, ULAB',
  degree: 'MSc Data Science (Distinction), Universiti Malaya  ·  BSc CSE (Magna Cum Laude), UIU',
  role: 'Research Supervisor & AI/ML Architecture Lead',
  bio: 'Specializes in NLP, deep learning, and large-scale data processing. Industry experience as Co-founder & CTO of Hadodo IT Ltd. with ESG-focused digital innovation and Industry 4.0 research.',
  skills: ['Python', 'Deep Learning', 'NLP', 'Apache Spark', 'Data Science'],
  photo: '/team/supervisor.jpeg',
  linkedin: 'https://www.linkedin.com/in/nasir-uddin-ahmed-184469137/',
};

const MEMBERS: Person[] = [
  {
    name: 'Rakibul Hasan',
    title: 'BSc in CSE (Ongoing), ULAB',
    degree: '',
    role: 'Backend & Data Pipeline Engineer',
    bio: 'Architected the real-time hydrological data ingestion pipeline across 3 monitoring stations. Implemented flood-risk scoring APIs and OOP-based backend modules powering the prediction engine.',
    skills: ['Python', 'FastAPI', 'OOP', 'REST APIs'],
    photo: '/team/member1.jpeg',
    linkedin: 'https://www.linkedin.com/in/rakibul-hasan20/',
  },
  {
    name: 'Rabbi Sadnan Khan',
    title: 'BSc in CSE (Ongoing), ULAB',
    degree: '',
    role: 'Full-Stack & Dashboard Lead',
    bio: 'Built the production-grade React/TypeScript dashboard with glassmorphic UI, real-time risk visualization, and live ENSO forecast integration. Owns the full frontend architecture and deployment pipeline.',
    skills: ['React', 'TypeScript', 'FastAPI', 'Framer Motion'],
    photo: '/team/member2.jpg',
    linkedin: 'https://www.linkedin.com/in/rabbisadnan26/',
  },
  {
    name: 'Faria Islam Sara',
    title: 'BSc in CSE (Final Year), ULAB',
    degree: '',
    role: 'ML Engineer & Climate Data Analyst',
    bio: 'Designed and trained 6+ ML models for ENSO-based flood prediction using NASA and NOAA climate datasets. Led data preprocessing pipelines and model evaluation frameworks with Django backend integration.',
    skills: ['Python', 'Machine Learning', 'Django', 'MongoDB'],
    photo: '/team/member3.jpeg',
    linkedin: 'https://www.linkedin.com/in/faria-islam-sara-73ab0b409/',
  },
  {
    name: 'Maruf Hossain',
    title: 'BSc in CSE (Ongoing), ULAB',
    degree: '',
    role: 'AI/ML Engineer & Research Lead',
    bio: 'Developed XGBoost and LSTM models for long-range flood forecasting. Led research paper authorship, AI model benchmarking, and integration of ML inference into the OceanSense production API.',
    skills: ['Python', 'XGBoost', 'LSTM', 'Data Science'],
    photo: '/team/member4.jpg',
    linkedin: 'https://www.linkedin.com/in/maruf-hossain-9055b12a1/',
  },
];

/* ─── Stats ──────────────────────────────────────────────── */
const STATS = [
  { icon: Users, value: '4 + 1', label: 'Team Members' },
  { icon: Cpu, value: '6+', label: 'AI Models Trained' },
  { icon: Waves, value: '3', label: 'Monitoring Stations' },
  { icon: Award, value: '1', label: 'Research Paper Submitted' },
];

/* ─── Skill Tag ──────────────────────────────────────────── */
const Tag = ({ label }: { label: string }) => (
  <motion.span
    whileHover={{ filter: 'brightness(1.25)' }}
    className="inline-flex items-center px-2.5 py-[5px] rounded-md text-[11px] font-semibold
      bg-[#00d4ff12] text-[#00d4ff] border border-[#00d4ff25] tracking-wide cursor-default select-none"
  >
    {label}
  </motion.span>
);

/* ─── Section Divider ────────────────────────────────────── */
const SectionLabel = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="relative flex items-center gap-4 mb-10">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00d4ff30] to-transparent" />
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00d4ff0a] border border-[#00d4ff18]
      text-[#00d4ff] text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00d4ff30] to-transparent" />
  </div>
);

/* ─── Stats Banner ───────────────────────────────────────── */
const StatsBanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
    >
      {STATS.map(({ icon: Icon, value, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          whileHover={{ translateY: -3, boxShadow: '0 8px 28px rgba(0,212,255,0.12)' }}
          className="rounded-xl p-6 text-center border border-[#00d4ff12]
            bg-gradient-to-b from-[#0f1d32] to-[#0a1628] cursor-default"
        >
          <Icon className="w-5 h-5 text-[#00d4ff] mx-auto mb-3 opacity-75" />
          <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
          <div className="text-[#94a3b8] text-[11px] uppercase tracking-widest">{label}</div>
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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative rounded-2xl overflow-hidden border border-[#00d4ff28]
        bg-gradient-to-br from-[#0f1d38] via-[#0c1830] to-[#080f20]
        shadow-[0_0_50px_rgba(0,212,255,0.06)]"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-80" />

      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-[#00d4ff20] blur-xl" />
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#00d4ff35]
                shadow-[0_0_28px_rgba(0,212,255,0.2)] relative z-10">
                <img src={SUPERVISOR.photo} alt={SUPERVISOR.name}
                  className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Role badge */}
            <p className="text-[#00d4ff] text-[11px] font-bold uppercase tracking-[0.12em] mb-2 font-mono">
              {SUPERVISOR.role}
            </p>

            {/* Name + social */}
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {SUPERVISOR.name}
              </h2>
              <a href={SUPERVISOR.linkedin} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold
                  bg-[#0077b510] border border-[#0077b530] text-[#0ea5e9]
                  hover:bg-[#0077b520] hover:border-[#0077b550] transition-all duration-200"
                title="LinkedIn Profile">
                <LinkedInIcon className="w-3 h-3" />
                LinkedIn
              </a>
            </div>

            {/* Title */}
            <p className="text-[#94a3b8] text-sm mb-1">{SUPERVISOR.title}</p>

            {/* Degrees */}
            <div className="flex items-start gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5 opacity-70" />
              <p className="text-[#94a3b8] text-sm">{SUPERVISOR.degree}</p>
            </div>

            {/* Bio */}
            <p className="text-white/75 text-sm leading-relaxed mb-5 max-w-2xl">
              {SUPERVISOR.bio}
            </p>

            {/* Skills */}
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
      transition={{ duration: 0.5, delay: index * 0.09, ease: 'easeOut' }}
      whileHover={{ translateY: -4, boxShadow: '0 16px 48px rgba(0,212,255,0.09)' }}
      className="group relative rounded-2xl border border-[#ffffff0c]
        bg-gradient-to-b from-[#0f1d32] to-[#0a1424]
        hover:border-[#00d4ff20] transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Hover accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent
        opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#ffffff15]
              group-hover:border-[#00d4ff30] transition-colors duration-300 shadow-lg">
              <img src={person.photo} alt={person.name}
                className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Name block */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-[18px] font-semibold text-white tracking-tight leading-snug">
                {person.name}
              </h3>
              <a href={person.linkedin} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-md bg-[#0077b50c] border border-[#0077b525] text-[#0ea5e9]
                  hover:bg-[#0077b518] hover:border-[#0077b540] transition-all duration-200"
                title="LinkedIn Profile">
                <LinkedInIcon className="w-3 h-3" />
              </a>
              {person.email && (
                <a href={`mailto:${person.email}`}
                  className="p-1.5 rounded-md bg-white/4 border border-white/8 text-[#94a3b8]
                    hover:text-white hover:border-white/15 transition-all duration-200"
                  title="Email">
                  <Mail className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[#94a3b8] text-xs">{person.title}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#ffffff08] group-hover:bg-[#00d4ff10] transition-colors duration-300" />

        {/* Role */}
        <div>
          <p className="text-[#00d4ff] text-[11px] font-bold uppercase tracking-[0.1em] mb-3 font-mono">
            {person.role}
          </p>

          {/* Bio — 2 sentences max, no toggle */}
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            {person.bio}
          </p>
        </div>

        {/* Skills — bottom */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
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
      className="rounded-2xl border border-[#ffffff08] p-10 md:p-12 text-center
        bg-gradient-to-br from-[#0f1d32]/60 to-[#0a1424]/80 backdrop-blur-sm"
    >
      {/* Logo mark */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
        bg-[#00d4ff0f] border border-[#00d4ff1a] mb-6">
        <GraduationCap className="w-7 h-7 text-[#00d4ff]" />
      </div>

      <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
        University of Liberal Arts Bangladesh
      </h3>
      <p className="text-[#00d4ff] text-sm font-semibold mb-4 tracking-wide">
        Department of Computer Science & Engineering
      </p>
      <p className="text-[#94a3b8] text-sm max-w-lg mx-auto leading-relaxed mb-6">
        Capstone Project combining academic research, AI/ML engineering, and real-world climate data to deliver a production-grade flood early warning system for Bangladesh.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium
            bg-[#ffffff06] border border-[#ffffff0e] text-[#94a3b8]">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const About = () => {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#0a1628' }}>
      <Navbar />

      <main className="pt-28 pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* ── Hero ── */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
            className="text-center mb-14"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
              bg-[#00d4ff0d] border border-[#00d4ff1e]
              text-[#00d4ff] text-[11px] font-bold uppercase tracking-[0.12em]">
              <FlaskConical className="w-3.5 h-3.5" />
              Capstone Research Project · ULAB
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
              The Team Behind{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] via-[#67e8f9] to-[#00d4ff]">
                OceanSense
              </span>
            </h1>

            <p className="text-[#94a3b8] max-w-xl mx-auto text-base leading-relaxed">
              An AI-powered flood early warning system for Bangladesh, developed at the University of Liberal Arts Bangladesh using machine learning, ENSO climate indices, and real-time hydrological data.
            </p>
          </motion.div>

          {/* ── Stats ── */}
          <StatsBanner />

          {/* ── Supervisor ── */}
          <SectionLabel icon={Award} label="Project Supervisor" />
          <div className="mb-14">
            <SupervisorCard />
          </div>

          {/* ── Team ── */}
          <SectionLabel icon={Users} label="Core Development Team" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
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
