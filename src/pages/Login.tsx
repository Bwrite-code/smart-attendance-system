import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Presentation, ShieldCheck, ArrowRight, Fingerprint } from 'lucide-react';
import type { Role } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const roles: { id: Role; title: string; desc: string; icon: typeof GraduationCap; accent: string }[] = [
  { id: 'student', title: 'Student', desc: 'Check in to classes with 4-stage verification', icon: GraduationCap, accent: 'text-accent' },
  { id: 'lecturer', title: 'Lecturer', desc: 'Create sessions, monitor live check-ins', icon: Presentation, accent: 'text-success' },
  { id: 'admin', title: 'Administrator', desc: 'System-wide analytics and fraud prevention', icon: ShieldCheck, accent: 'text-danger' },
];

export function Login() {
  const navigate = useNavigate();

  const handleSelect = (role: Role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-bg-base dot-grid grain flex items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] mb-6 glow-accent">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-fg mb-2">Smart Attendance System</h1>
          <p className="text-fg-muted text-sm">Select a portal to continue · University Edition</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="space-y-3">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(role.id)}
                  className="group w-full flex items-center gap-4 p-5 bg-bg-elevated border border-border rounded-lg hover:border-border-hover transition-colors text-left"
                >
                  <div className={`w-12 h-12 rounded-lg bg-bg-elevated-2 flex items-center justify-center ${role.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-fg">{role.title}</h3>
                    <p className="text-xs text-fg-muted">{role.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-fg-dim group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Back to landing page
          </Button>
        </motion.div>

        <p className="text-center text-[10px] text-fg-dim mt-8"></p>
      </div>
    </div>
  );
}
