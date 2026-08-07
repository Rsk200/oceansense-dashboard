import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Cpu, Users, Award,
  Waves, FlaskConical, Star, Mail
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
  objectPosition?: string;
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
    title: 'BSc in CSE · ULAB',
    degree: '',
    role: 'AI/ML Engineer & Research Lead',
    bio: 'Leads the research and development of AI-driven forecasting models for OceanSense. Specializes in Artificial Intelligence, Machine Learning, and deep learning techniques for ENSO prediction. Conducts literature reviews, develops predictive algorithms, and optimizes model performance to improve long-term climate forecasting and early disaster warning capabilities.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'Research'],
    photo: '/team/member1.jpeg',
    linkedin: 'https://www.linkedin.com/in/rakibul-hasan20/',
    objectPosition: '50% 15%',
  },
  {
    name: 'Rabbi Sadnan Khan',
    title: 'BSc in CSE · ULAB',
    degree: '',
    role: 'Full Stack Developer & AI Researcher',
    bio: 'Designs and develops the complete OceanSense platform, including frontend interfaces, backend services, APIs, and cloud-based infrastructure. Integrates AI prediction models into the web application while contributing to AI research, system optimization, and scalable software solutions that ensure reliable and efficient deployment.',
    skills: ['React', 'TypeScript', 'FastAPI', 'Cloud'],
    photo: '/team/member2.jpg',
    linkedin: 'https://www.linkedin.com/in/rabbisadnan26/',
    objectPosition: '50% 12%',
  },
  {
    name: 'Faria Islam Sara',
    title: 'BSc in CSE · ULAB',
    degree: '',
    role: 'Data Engineer & Geospatial Analytics Specialist',
    bio: 'Builds and manages data pipelines for processing climate, hydrological, satellite, and environmental datasets. Specializes in geospatial analytics, GIS, and remote sensing to generate interactive flood risk maps, spatial visualizations, and data-driven insights that support accurate climate forecasting and disaster assessment.',
    skills: ['Python', 'Data Engineering', 'GIS', 'Remote Sensing'],
    photo: '/team/member3.jpeg',
    linkedin: 'https://www.linkedin.com/in/faria-islam-sara-73ab0b409/',
    objectPosition: '50% 20%',
  },
  {
    name: 'Md. Maruf Hossain',
    title: 'BSc in CSE · ULAB',
    degree: '',
    role: 'Disaster Intelligence Engineer & UI/UX Designer',
    bio: 'Analyzes disaster risk patterns and translates complex prediction results into intuitive, user-friendly experiences. Designs interactive dashboards, risk communication systems, and responsive interfaces that enhance decision-making, improve accessibility, and help communities understand and respond to climate-related hazards effectively.',
    skills: ['UI/UX Design', 'Risk Analysis', 'Figma', 'React'],
    photo: '/team/member4.jpg',
    linkedin: 'https://www.linkedin.com/in/maruf-hossain-9055b12a1/',
    objectPosition: '50% 10%',
  },
];

/* ─── Skill Tag ──────────────────────────────────────────── */
const Tag = ({ label }: { label: string }) => (
  <motion.span
    whileHover={{ filter: 'brightness(1.35)', scale: 1.05 }}
    transition={{ duration: 0.15 }}
    className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold
      bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wide cursor-default select-none"
  >
    {label}
  </motion.span>
);

/* ─── Stats Banner ───────────────────────────────────────── */
const STATS = [
  { icon: Users,  value: '4+1', label: 'Team Members',            color: 'from-blue-500/20 to-blue-600/5',   border: 'border-blue-500/20',  icon_color: 'text-blue-400' },
  { icon: Cpu,    value: '6+',  label: 'AI Models Trained',        color: 'from-cyan-500/20 to-cyan-600/5',   border: 'border-cyan-500/20',  icon_color: 'text-cyan-400' },
  { icon: Waves,  value: '3',   label: 'Monitoring Stations',      color: 'from-teal-500/20 to-teal-600/5',   border: 'border-teal-500/20',  icon_color: 'text-teal-400' },
  { icon: Award,  value: '1',   label: 'Research Paper Submitted', color: 'from-violet-500/20 to-violet-600/5', border: 'border-violet-500/20', icon_color: 'text-violet-400' },
];

const StatsBanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
    >
      {STATS.map(({ icon: Icon, value, label, color, border, icon_color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ translateY: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
          className={`rounded-2xl p-6 text-center border ${border}
            bg-gradient-to-b ${color} backdrop-blur-sm cursor-default
            shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}
        >
          <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4
            bg-white/5 border ${border}`}>
            <Icon className={`w-5 h-5 ${icon_color}`} />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1.5 tracking-tight leading-none">
            {value}
          </div>
          <div className="text-slate-400 text-[11px] uppercase tracking-[0.1em] font-semibold leading-snug">
            {label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ─── Section Divider ────────────────────────────────────── */
const SectionLabel = ({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub?: string }) => (
  <div className="flex flex-col items-center gap-3 mb-12">
    <div className="flex items-center gap-3 px-6 py-3 rounded-full
      bg-cyan-500/10 border border-cyan-500/25
      shadow-[0_0_30px_rgba(0,212,255,0.1)]">
      <Icon className="w-4 h-4 text-cyan-400" />
      <span className="text-cyan-300 text-sm font-bold uppercase tracking-[0.15em]">{label}</span>
    </div>
    {sub && (
      <p className="text-slate-500 text-[13px] text-center">{sub}</p>
    )}
  </div>
);

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
      className="relative rounded-2xl overflow-hidden
        border border-cyan-400/20
        shadow-[0_0_0_1px_rgba(0,212,255,0.05),0_8px_60px_rgba(0,0,0,0.6)]"
      style={{ background: 'linear-gradient(140deg, #0e2247 0%, #091a38 60%, #060f24 100%)' }}
    >
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90" />

      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 20%, #00d4ff, transparent 70%)' }} />

      {/* Supervisor badge */}
      <div className="absolute top-5 right-5 z-10 flex items-center gap-2 px-3.5 py-2
        rounded-full bg-cyan-400/10 border border-cyan-400/25
        text-cyan-300 text-[11px] font-bold uppercase tracking-[0.12em]">
        <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
        Project Supervisor
      </div>

      <div className="relative p-10 md:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Photo column */}
          <div className="flex-shrink-0 flex flex-col items-center gap-5">
            {/* Photo with glowing rings */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-full opacity-30 blur-2xl"
                style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
              <div className="absolute -inset-1.5 rounded-full border border-cyan-400/20" />
              <div className="absolute -inset-3 rounded-full border border-cyan-400/10" />
              <div className="w-40 h-40 rounded-full overflow-hidden relative z-10
                border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                <img
                  src={SUPERVISOR.photo}
                  alt={SUPERVISOR.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 20%', filter: 'brightness(1.05) contrast(1.05)' }}
                />
              </div>
            </div>

            {/* LinkedIn button */}
            <a
              href={SUPERVISOR.linkedin}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                bg-[#0077b5]/15 border border-[#0077b5]/35 text-sky-300
                hover:bg-[#0077b5]/25 hover:border-[#0077b5]/55 hover:text-white
                transition-all duration-200 shadow-sm"
            >
              <LinkedInIcon className="w-4 h-4" />
              LinkedIn Profile
            </a>
          </div>

          {/* Info column */}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.16em] mb-3 font-mono">
              {SUPERVISOR.role}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 leading-tight">
              {SUPERVISOR.name}
            </h2>
            <p className="text-slate-400 text-sm mb-5">{SUPERVISOR.title}</p>

            {/* Degree box */}
            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl
              bg-white/[0.04] border border-white/8">
              <GraduationCap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm leading-relaxed">{SUPERVISOR.degree}</p>
            </div>

            {/* Bio */}
            <p className="text-slate-300 text-[15px] leading-[1.75] mb-7">
              {SUPERVISOR.bio}
            </p>

            <div className="h-px bg-white/8 mb-6" />

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
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ translateY: -6 }}
      className="group relative rounded-2xl flex flex-col overflow-hidden
        border border-white/8 hover:border-cyan-400/25
        shadow-[0_4px_32px_rgba(0,0,0,0.5)]
        transition-all duration-300"
      style={{ background: 'linear-gradient(160deg, #0d1f3a 0%, #091629 100%)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-cyan-400 to-transparent
        opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
        style={{ boxShadow: 'inset 0 0 40px rgba(0,212,255,0.04)' }} />

      <div className="relative p-7 flex flex-col gap-5 flex-1">

        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-full bg-cyan-400/15 blur-md
              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden relative z-10
              border-2 border-white/15 group-hover:border-cyan-400/40
              shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors duration-300">
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: person.objectPosition ?? '50% 15%',
                  filter: 'brightness(1.1) contrast(1.05) saturate(1.05)'
                }}
              />
            </div>
          </div>

          {/* Name + title + social */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-[18px] font-bold text-white tracking-tight leading-none">
                {person.name}
              </h3>
              <a
                href={person.linkedin}
                target="_blank" rel="noreferrer"
                title="LinkedIn Profile"
                className="flex-shrink-0 p-1.5 rounded-lg
                  bg-[#0077b5]/10 border border-[#0077b5]/25 text-sky-400
                  hover:bg-[#0077b5]/22 hover:border-[#0077b5]/45 hover:text-white
                  transition-all duration-200"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
              {person.email && (
                <a href={`mailto:${person.email}`} title="Email"
                  className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 border border-white/10
                    text-slate-400 hover:text-white hover:border-white/20 transition-all duration-200">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-slate-500 text-[12px]">{person.title}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6 group-hover:bg-cyan-400/12 transition-colors duration-300" />

        {/* Role + Bio */}
        <div className="flex-1">
          <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3 font-mono">
            {person.role}
          </p>
          <p className="text-slate-300 text-[13.5px] leading-[1.7]">
            {person.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/6">
          {person.skills.map(s => <Tag key={s} label={s} />)}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Affiliation ────────────────────────────────────────── */
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
      className="relative rounded-2xl border border-white/8 overflow-hidden text-center
        shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
      style={{ background: 'linear-gradient(140deg, #0d2040 0%, #091629 100%)' }}
    >
      {/* Top glow bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-[2px]
        bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

      {/* Glow blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-48 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07), transparent 70%)' }} />

      <div className="relative p-12 md:p-16">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-7
          bg-cyan-500/10 border border-cyan-400/20
          shadow-[0_0_30px_rgba(0,212,255,0.1)]">
          <GraduationCap className="w-8 h-8 text-cyan-400" />
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
          University of Liberal Arts Bangladesh
        </h3>
        <p className="text-cyan-400 text-sm font-bold tracking-wider uppercase mb-1">
          Department of Computer Science & Engineering
        </p>
        <p className="text-slate-500 text-sm mb-1 font-mono">Dhaka, Bangladesh</p>

        <div className="w-16 h-px bg-cyan-400/25 mx-auto my-6" />

        <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed mb-8">
          Capstone project combining academic research, AI/ML engineering, and real-world
          hydrological climate data to deliver a production-grade flood early warning system for Bangladesh.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          {tags.map(tag => (
            <span key={tag}
              className="px-4 py-2 rounded-full text-xs font-semibold cursor-default
                bg-white/5 border border-white/10 text-slate-400
                hover:text-white hover:border-white/20 transition-colors duration-200">
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
    <div className="min-h-screen overflow-hidden" style={{ background: '#040d1c' }}>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8
                bg-cyan-500/10 border border-cyan-500/20
                text-cyan-300 text-[11px] font-bold uppercase tracking-[0.15em]
                shadow-[0_0_20px_rgba(0,212,255,0.08)]"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Capstone Research Project · ULAB
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              The Team Behind{' '}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #67e8f9, #00d4ff)' }}>
                OceanSense
              </span>
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto text-[16px] leading-[1.8]">
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
            sub="Faculty mentor and AI/ML research lead for the OceanSense capstone project"
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
