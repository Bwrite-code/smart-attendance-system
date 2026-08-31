import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { QrCode, MapPin, ScanFace, Clock, ArrowRight, ShieldCheck, GraduationCap, Presentation, Zap, TrendingUp, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Typewriter, AnimatedCounter, KineticHeading } from '@/components/ui/Kinetic';

const typewriterLines = [
  'Smart Attendance System.',
  'A project by ADARAMOLA OLUWATIMILEHIN and ',
  'ADEBIYI TORHEEB.',
  'Scan. Locate. Verify. Confirm',
  'Your face is the only password that matters.',
  "If you're not in the room, you're not in the record.",
  "One tap isn't proof of presence. This is.",
];

const stages = [
  { icon: QrCode, title: 'QR Scan', desc: 'Session QR decoded on-site to bind check-in to a live class', key: 'qr' },
  { icon: MapPin, title: 'GPS Geofence', desc: 'Location validated within a radius around the lecture hall', key: 'gps' },
  { icon: ScanFace, title: 'Facial Match', desc: 'Identity verified against a registered reference template', key: 'facial' },
  { icon: Clock, title: 'Timestamp', desc: 'Check-in confirmed within the allowed session time window', key: 'timestamp' },
];

const stats = [
  { value: 95, suffix: '%', label: 'Verification accuracy target' },
  { value: 100, suffix: '%', label: 'Proxy attendance eliminated' },
  { value: 4, suffix: '×', label: 'Layered verification checks' },
  { value: 3, suffix: 's', label: 'Average check-in time' },
];

const portals = [
  { icon: GraduationCap, title: 'Student App', desc: 'Mobile-first check-in with live multi-stage verification', accent: 'accent' },
  { icon: Presentation, title: 'Lecturer Console', desc: 'Create sessions, monitor live check-ins in real time', accent: 'success' },
  { icon: ShieldCheck, title: 'Admin Portal', desc: 'System-wide analytics and fraud prevention dashboard', accent: 'danger' },
];

export function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-bg-base dot-grid grain">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-sm font-semibold text-fg hidden sm:block">Smart Attendance System</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button size="sm" magnetic onClick={() => navigate('/login')}>
              Enter Portals <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-xs text-fg-muted mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-accent" />
           Are you in class?
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-fg leading-[1.06] text-balance">
              <span className="block text-gradient-accent">Design and Implementation of a Smart Attendance System Management</span>
            </h1>
            <p className="mt-5 text-[11px] md:text-sm text-fg-dim uppercase tracking-[0.16em] font-medium leading-relaxed max-w-4xl mx-auto">
              By Adaramola Oluwatimilehin Samuel &amp; Adebiyi Torheeb Olamilekan
            </p>
            <p className="mt-2 text-[10px] md:text-xs text-fg-dim/80 leading-relaxed">
              Department of Computer Science, BOUESTI
            </p>
          </motion.div>

          <div className="min-h-[3.5rem] md:min-h-[5rem] flex items-center justify-center mb-8">
            <KineticHeading className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-fg leading-tight text-balance">
              <Typewriter
                lines={typewriterLines}
                speed={42}
                deleteSpeed={22}
                pauseDuration={2000}
                className="text-gradient-accent"
              />
            </KineticHeading>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="text-fg-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            A multi-stage verification system combining QR codes, GPS geofencing, facial recognition, and timestamp validation to eliminate proxy attendance across university campuses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" magnetic onClick={() => navigate('/login')}>
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/student')}>
              Try Student Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* 4-stage process diagram */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="font-display text-2xl font-semibold text-fg text-center mb-2">The Verification Pipeline</h2>
          <p className="text-fg-muted text-sm text-center mb-12">Every check-in passes through four independent security layers</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div key={stage.key} className="flex items-stretch flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="flex-1 bg-bg-elevated border border-border rounded-lg p-5 relative group hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-bg-elevated-2 flex items-center justify-center text-accent group-hover:glow-accent transition-shadow">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-display text-3xl text-border font-semibold">{i + 1}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-fg mb-1">{stage.title}</h3>
                  <p className="text-xs text-fg-muted leading-relaxed">{stage.desc}</p>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5"
                    style={{ background: 'linear-gradient(to right, var(--accent), var(--success))' }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.12 + 0.3 }}
                  />
                </motion.div>
                {i < stages.length - 1 && (
                  <div className="hidden md:flex items-center px-1">
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.4 }}>
                      <ArrowRight className="w-4 h-4 text-border-hover" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="text-center bg-bg-elevated border border-border rounded-lg p-6 hover:border-border-hover transition-colors"
            >
              <p className="font-display text-4xl font-bold text-gradient-accent">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-fg-muted mt-2 leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portals */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl font-semibold text-fg text-center mb-2">Three Portals, One System</h2>
          <p className="text-fg-muted text-sm text-center mb-12">Role-based access for students, lecturers, and administrators</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {portals.map((portal, i) => {
            const Icon = portal.icon;
            const accentClass = portal.accent === 'accent' ? 'text-accent' : portal.accent === 'success' ? 'text-success' : 'text-danger';
            return (
              <motion.button
                key={portal.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="group bg-bg-elevated border border-border rounded-lg p-6 text-left hover:border-border-hover transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg bg-bg-elevated-2 flex items-center justify-center mb-4 ${accentClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-fg mb-1">{portal.title}</h3>
                <p className="text-xs text-fg-muted leading-relaxed mb-4">{portal.desc}</p>
                <span className={`inline-flex items-center gap-1 text-xs ${accentClass}`}>
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-bg-elevated to-bg-elevated-2 border border-border rounded-lg p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="relative">
            <TrendingUp className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-fg mb-3">See it in action</h2>
            <p className="text-fg-muted text-sm max-w-md mx-auto mb-8">
              Experience the full 4-stage verification flow, live session monitoring, and system-wide fraud analytics.
            </p>
            <Button size="lg" magnetic onClick={() => navigate('/login')}>
              Launch Product <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-sm text-fg">Smart Attendance System</span>
          </div>
          <p className="text-[10px] text-fg-dim text-center">
            Design and Implementation of a Smart Attendance System Management<br />
            Adaramola Oluwatimilehin Samuel &amp; Adebiyi Torheeb Olamilekan — Computer Science, BOUESTI
          </p>
          <p className="text-[10px] text-fg-dim"></p>
        </div>
      </footer>
    </div>
  );
}
