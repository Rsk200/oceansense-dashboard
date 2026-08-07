import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Briefcase, Code2, Globe2,
  Linkedin, Github, Mail, ChevronDown, ChevronUp,
  Star, FlaskConical, Cpu, BookOpen, Users, Award
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── Types ─────────────────────────────────────────────── */
interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  image: string;
  shortBio: string;
  fullBio: string;
  specialties: string[];
  education: string[];
  skills: string[];
  linkedin?: string;
  github?: string;
  email?: string;
  isSupervisor?: boolean;
  researchFocus?: string[];
}

/* ─── Data ───────────────────────────────────────────────── */
const SUPERVISOR: TeamMember = {
  id: 'supervisor',
  isSupervisor: true,
  name: 'Nasir Uddin Ahmed',
  role: 'Project Supervisor',
  dept: 'Lecturer, Dept. of Computer Science & Engineering · ULAB',
  image: '/team/supervisor.jpeg',
  shortBio: 'Data Scientist, Software Engineer & Academic mentor with an MSc in Data Science (Distinction) from Universiti Malaya and a BSc in CSE (Magna Cum Laude) from United International University.',
  fullBio: `I am a Lecturer in the Department of Computer Science & Engineering at ULAB (University of Liberal Arts Bangladesh), a Data Scientist, and a Software Engineer with a strong academic background — holding an MSc in Data Science (Distinction, Universiti Malaya) and a BSc in CSE (Magna Cum Laude, United International University).

My professional journey spans teaching, research, and industry experience. I specialize in Data Science, AI, NLP, and Machine Learning, with hands-on expertise in Python, deep learning models (including BERT for NLP), and large-scale data processing frameworks like Apache Spark.

I have served as Co-founder & CTO of Hadodo IT Ltd., leading ESG-focused digital innovation projects, and worked in various software development and data roles, contributing to end-to-end AI-driven solutions. My research focuses on Industry 4.0, strategic agility, digital innovation performance, and sentiment analysis, with publications in international conferences and journals.

I am passionate about mentoring students, driving impactful research, and bridging academia with industry to foster sustainable digital transformation.`,
  specialties: [
    'Teaching & Academic Mentoring in AI, ML, and Data Science',
    'NLP, Sentiment Analysis & Deep Learning',
    'Software Development & Agile Practices',
    'Research on Industry 4.0, ESG & Digital Innovation',
    'Data Visualization & Analytics',
  ],
  education: [
    'MSc in Data Science — Distinction, Universiti Malaya',
    'BSc in CSE — Magna Cum Laude, United International University',
  ],
  skills: ['Python', 'BERT / NLP', 'Apache Spark', 'Deep Learning', 'Data Science', 'Agile', 'ESG Research'],
  researchFocus: ['Industry 4.0', 'Sentiment Analysis', 'Digital Innovation', 'Strategic Agility'],
  linkedin: 'https://www.linkedin.com/in/nasir-uddin-ahmed/',
};

const MEMBERS: TeamMember[] = [
  {
    id: 'member1',
    name: 'Rakibul Hasan',
    role: 'Team Member',
    dept: 'Computer Science & Engineering · ULAB',
    image: '/team/member1.jpeg',
    shortBio: 'Passionate CSE student with a track record of consistently bright academic results and a diverse technical skill set spanning programming, OOP, and digital marketing.',
    fullBio: `I am Rakibul Hasan. In my childhood, I was always brilliant, constantly striving to improve myself and never backing down from any challenge. My academic journey has been marked by consistently bright results, a trend that continues as I pursue a degree in Computer Science and Engineering at university.

I have cultivated a diverse skill set, including proficiency in programming, object-oriented programming (OOP), and digital marketing. In addition to my technical abilities, I also excel in teaching and influencing others, making me a valuable resource to my family, friends, and relatives.

Beyond professional pursuits, I am deeply committed to embodying the qualities of a good person and making a positive impact on my community and society as a whole. Whether through academic achievements, professional endeavors, or personal interactions, I am dedicated to leveraging my skills and talents for the betterment of others.

As I continue to grow and evolve, I remain steadfast in my commitment to continuous learning and making meaningful contributions to society and my country.`,
    specialties: ['Programming & OOP', 'Digital Marketing', 'Academic Excellence', 'Teaching & Mentoring'],
    education: ['BSc in CSE (ongoing) — ULAB'],
    skills: ['Python', 'OOP', 'Digital Marketing', 'Teaching'],
  },
  {
    id: 'member2',
    name: 'Rabbi Sadnan Khan',
    role: 'Team Member',
    dept: 'Computer Science & Engineering · ULAB',
    image: '/team/member2.jpg',
    shortBio: 'Full-stack developer and AI enthusiast contributing to the OceanSense platform architecture, dashboard design, and real-time data visualizations.',
    fullBio: `Rabbi Sadnan Khan is a Computer Science & Engineering student at ULAB with a strong focus on full-stack development, AI integration, and modern web technologies.

As a core contributor to OceanSense, Rabbi led the development of the premium dashboard interface, real-time risk visualization modules, and the AI pipeline integration layer. His deep interest in creating intuitive and data-driven user interfaces has been instrumental in translating complex flood-risk data into actionable insights for end-users.

He is passionate about building scalable, beautiful, and performant software that makes a real-world impact.`,
    specialties: ['Full-Stack Development', 'UI/UX Design', 'Real-time Data Visualization', 'AI Integration'],
    education: ['BSc in CSE (ongoing) — ULAB'],
    skills: ['React', 'TypeScript', 'Python', 'FastAPI', 'Tailwind CSS', 'Framer Motion'],
    linkedin: 'https://www.linkedin.com/in/rabbi-sadnan-khan/',
  },
  {
    id: 'member3',
    name: 'Faria Islam Sara',
    role: 'Team Member',
    dept: 'Computer Science & Engineering · ULAB',
    image: '/team/member3.jpeg',
    shortBio: 'Final-year CSE undergraduate passionate about AI, ML, Climate Technology, and Full-Stack Development, with hands-on experience in NASA datasets and climate-risk prediction.',
    fullBio: `Final-year Computer Science and Engineering undergraduate passionate about Artificial Intelligence, Machine Learning, Climate Technology, and Full-Stack Development.

I have worked on projects involving NASA datasets, weather forecasting, climate-risk prediction, and AI-driven educational platforms. My technical interests include machine learning, data analysis, backend development, and sustainable technology solutions.

Skilled in Python, Django, JavaScript, MongoDB, REST APIs, and software engineering methodologies including Agile Scrum.

Currently seeking opportunities in software engineering, AI/ML research, and impactful technology projects where I can apply my technical and problem-solving skills.`,
    specialties: ['Machine Learning & AI', 'Climate Risk Prediction', 'Backend Development', 'NASA Dataset Analysis'],
    education: ['BSc in CSE (Final Year) — ULAB'],
    skills: ['Python', 'Django', 'JavaScript', 'MongoDB', 'REST APIs', 'Agile Scrum', 'Machine Learning'],
    github: 'https://github.com/',
  },
  {
    id: 'member4',
    name: 'Maruf Hossain',
    role: 'Team Member',
    dept: 'Computer Science & Engineering · ULAB',
    image: '/team/member4.jpg',
    shortBio: 'AI/ML enthusiast and full-stack developer who co-developed OceanSense as his capstone project, combining machine learning with climate data for long-term flood forecasting in Bangladesh.',
    fullBio: `I am a Computer Science and Engineering student at the University of Liberal Arts Bangladesh with a passion for software development, artificial intelligence, machine learning, and web technologies.

I enjoy designing and building practical solutions using Python, JavaScript, HTML, CSS, and modern development tools. I am passionate about solving real-world problems through technology while continuously expanding my knowledge of programming, software engineering, and emerging technologies.

My recent work includes OceanSense, an AI-powered early disaster warning system developed as my capstone project. The project combines machine learning and climate data to support long-term flood forecasting in Bangladesh. Alongside this, I have developed responsive web applications, including a personal portfolio website and an interactive JavaScript calculator, strengthening my frontend development and problem-solving skills.

I have also submitted a research paper based on the OceanSense project and continue to explore AI-driven solutions through research and hands-on development.

I am currently seeking internship and research opportunities where I can apply my technical skills, collaborate with talented teams, and continue growing as a software engineer while expanding my expertise in artificial intelligence and machine learning.`,
    specialties: ['AI & Machine Learning', 'Software Development', 'Web Development', 'Research & Publication'],
    education: ['BSc in CSE (ongoing) — ULAB'],
    skills: ['Python', 'JavaScript', 'HTML/CSS', 'Machine Learning', 'Data Science', 'Cloud Computing', 'Computer Vision'],
    github: 'https://github.com/',
  },
];

/* ─── Skill Tag ──────────────────────────────────────────── */
const SkillTag = ({ label }: { label: string }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold
    bg-accent/10 text-accent border border-accent/20 tracking-wide">
    {label}
  </span>
);

/* ─── Supervisor Card ────────────────────────────────────── */
const SupervisorCard = ({ member }: { member: TeamMember }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative rounded-2xl overflow-hidden border border-accent/25
        bg-gradient-to-br from-[#0b1e3d]/90 via-[#061428]/95 to-[#030a18]/90
        shadow-[0_0_60px_rgba(0,194,255,0.08)] backdrop-blur-xl"
    >
      {/* Top accent glow bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />

      {/* Corner badge */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-widest">
        <Star className="w-3 h-3" />
        Project Supervisor
      </div>

      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/30 blur-2xl scale-110 opacity-50" />
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-accent/40
                shadow-[0_0_40px_rgba(0,194,255,0.3)] relative z-10">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = 'none';
                    (t.parentElement as HTMLElement).classList.add('flex', 'items-center', 'justify-center', 'bg-accent/10');
                  }}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60
                    hover:text-accent hover:border-accent/30 transition-all duration-200">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60
                    hover:text-accent hover:border-accent/30 transition-all duration-200">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1 font-mono">
              Project Supervisor
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
              {member.name}
            </h2>
            <p className="text-white/50 text-sm mb-6 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
              {member.dept}
            </p>

            {/* Education Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {member.education.map(edu => (
                <div key={edu} className="flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-white/5 border border-white/10 text-white/70 text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  {edu}
                </div>
              ))}
            </div>

            {/* Short bio */}
            <p className="text-white/65 leading-relaxed mb-4">
              {member.shortBio}
            </p>

            {/* Expandable full bio */}
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/55 leading-relaxed text-sm whitespace-pre-line mb-4"
              >
                {member.fullBio}
              </motion.div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-accent text-xs font-semibold
                hover:text-accent/80 transition-colors mb-6"
            >
              {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show Less</> : <><ChevronDown className="w-3.5 h-3.5" /> Read Full Bio</>}
            </button>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {member.skills.map(s => <SkillTag key={s} label={s} />)}
            </div>

            {/* Specialties */}
            <div className="grid sm:grid-cols-2 gap-2">
              {member.specialties.map(s => (
                <div key={s} className="flex items-start gap-2 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>

            {/* Research focus tags */}
            {member.researchFocus && (
              <div className="mt-6 pt-5 border-t border-white/8">
                <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" />Research Focus
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.researchFocus.map(r => (
                    <span key={r} className="px-3 py-1 rounded-full text-xs font-medium
                      bg-violet-500/10 border border-violet-500/20 text-violet-300">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Member Card ────────────────────────────────────────── */
const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden border border-white/8
        bg-gradient-to-b from-[#0b1829]/80 to-[#040c1a]/90
        hover:border-accent/25 hover:shadow-[0_0_30px_rgba(0,194,255,0.07)]
        transition-all duration-400 backdrop-blur-md flex flex-col"
    >
      {/* Hover glow top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-transparent via-accent to-transparent
        opacity-0 group-hover:opacity-60 transition-opacity duration-400" />

      {/* Header with photo */}
      <div className="relative p-6 pb-4 flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-400" />
          <div className="w-20 h-20 rounded-full overflow-hidden border border-white/15
            group-hover:border-accent/35 transition-colors duration-300 relative z-10 shadow-xl">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                (t.parentElement as HTMLElement).classList.add('flex', 'items-center', 'justify-center', 'bg-white/5');
              }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <p className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono mb-0.5">
            Team Member
          </p>
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {member.name}
          </h3>
          <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 flex-shrink-0" />
            {member.education[0]}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 mt-2">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-md bg-white/5 border border-white/8 text-white/50
                  hover:text-accent hover:border-accent/30 transition-all duration-200">
                <Linkedin className="w-3 h-3" />
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-md bg-white/5 border border-white/8 text-white/50
                  hover:text-accent hover:border-accent/30 transition-all duration-200">
                <Github className="w-3 h-3" />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`}
                className="p-1.5 rounded-md bg-white/5 border border-white/8 text-white/50
                  hover:text-accent hover:border-accent/30 transition-all duration-200">
                <Mail className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/6 group-hover:bg-white/10 transition-colors duration-300" />

      {/* Body */}
      <div className="p-6 pt-4 flex-1 flex flex-col">
        {/* Short bio */}
        <p className="text-white/55 text-sm leading-relaxed mb-3">
          {member.shortBio}
        </p>

        {/* Expandable full bio */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-white/45 text-xs leading-relaxed whitespace-pre-line mb-3"
          >
            {member.fullBio}
          </motion.div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-accent/80 text-xs font-semibold
            hover:text-accent transition-colors mb-4 self-start"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> Read More</>}
        </button>

        {/* Specialties */}
        <div className="space-y-1.5 mb-4">
          {member.specialties.map(s => (
            <div key={s} className="flex items-center gap-2 text-white/50 text-xs">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              {s}
            </div>
          ))}
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/6">
          {member.skills.map(s => <SkillTag key={s} label={s} />)}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Stats Banner ───────────────────────────────────────── */
const stats = [
  { icon: Users, label: 'Team Members', value: '4 + 1' },
  { icon: Cpu, label: 'AI Models Trained', value: '6+' },
  { icon: Globe2, label: 'Stations Monitored', value: '3' },
  { icon: Award, label: 'Research Paper', value: 'Submitted' },
];

const StatsBanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 my-16"
    >
      {stats.map(({ icon: Icon, label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="rounded-xl p-5 text-center border border-white/8
            bg-gradient-to-b from-white/4 to-transparent backdrop-blur-sm
            hover:border-accent/20 transition-colors duration-300"
        >
          <Icon className="w-5 h-5 text-accent mx-auto mb-2 opacity-80" />
          <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
          <div className="text-white/40 text-xs uppercase tracking-wider">{label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ─── Main About Page ────────────────────────────────────── */
const About = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-ocean-radial overflow-hidden">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Hero Section ── */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-accent/10 border border-accent/20 text-accent text-xs font-bold
              uppercase tracking-widest mb-6">
              <Code2 className="w-3.5 h-3.5" />
              The Team Behind OceanSense
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-5 leading-tight">
              Built by Researchers,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-cyan-300 to-accent">
                Driven by Impact
              </span>
            </h1>

            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              OceanSense is a capstone research project developed at the University of Liberal Arts Bangladesh (ULAB), combining cutting-edge AI with real-time climate data to deliver life-saving flood early warnings for Bangladesh.
            </p>
          </motion.div>

          {/* ── Stats ── */}
          <StatsBanner />

          {/* ── Divider with label ── */}
          <div className="relative flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/8 border border-accent/15
              text-accent text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
              <Star className="w-3 h-3" />
              Project Supervisor
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
          </div>

          {/* ── Supervisor Card ── */}
          <div className="mb-16">
            <SupervisorCard member={SUPERVISOR} />
          </div>

          {/* ── Divider with label ── */}
          <div className="relative flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10
              text-white/60 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
              <Users className="w-3 h-3" />
              Development Team
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ── Team Members Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
            {MEMBERS.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>

          {/* ── University / Project Info footer band ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/8 p-8 md:p-12 text-center
              bg-gradient-to-br from-white/3 to-transparent backdrop-blur-sm"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full
              bg-accent/10 border border-accent/20 mb-5">
              <GraduationCap className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">University of Liberal Arts Bangladesh</h3>
            <p className="text-accent text-sm font-semibold mb-4">Department of Computer Science & Engineering</p>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              OceanSense was developed as a Capstone Project at ULAB, combining academic research, AI/ML engineering, and real-world climate data to create a production-grade flood early warning system for Bangladesh.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['Capstone Project', 'AI/ML Research', 'Climate Tech', 'Bangladesh', 'Flood Warning System'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium
                  bg-white/5 border border-white/10 text-white/55">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
