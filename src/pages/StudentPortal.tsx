import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, QrCode, Clock, TrendingUp, Flame, ArrowLeft, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { studentUser, courses, sessions, attendanceHistory } from '@/data/mockData';
import { VerificationFlow } from '@/pages/VerificationFlow';

type View = 'dashboard' | 'checkin' | 'history' | 'profile';

export function StudentPortal() {
  const [view, setView] = useState<View>('dashboard');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; course: string } | null>(null);
  const navigate = useNavigate();

  const activeSession = sessions.find((s) => s.status === 'active');
  const todayClasses = courses.filter((c) => studentUser.courses?.includes(c.code));

  if (view === 'checkin') {
    return (
      <VerificationFlow
        onBack={() => setView('dashboard')}
        onComplete={(result) => {
          setCheckInResult({ success: result.success, course: 'CSC 401' });
          setView('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg-base dot-grid grain">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 glass border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
                <Fingerprint className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-fg leading-none">Smart Attendance</p>
                <p className="text-[10px] text-fg-dim">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center gap-2 text-[10px] text-fg-dim">
                <button onClick={() => navigate('/')} className="hover:text-fg transition-colors">Home</button>
                <span>·</span>
                <button onClick={() => navigate('/login')} className="hover:text-fg transition-colors">Portal</button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-5 py-6 pb-24">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <p className="text-xs text-fg-dim uppercase tracking-wider mb-1">Welcome back</p>
                  <h1 className="font-display text-2xl font-bold text-fg">{studentUser.name}</h1>
                  <p className="text-xs text-fg-muted mt-0.5">{studentUser.matric} · {studentUser.level}</p>
                </div>

                {checkInResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`mb-4 p-4 rounded-lg border flex items-center gap-3 ${checkInResult.success ? 'border-[var(--success)]' : 'border-[var(--danger)]'}`}
                    style={{ background: checkInResult.success ? 'var(--success-soft)' : 'var(--danger-soft)' }}
                  >
                    {checkInResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${checkInResult.success ? 'text-success' : 'text-danger'}`}>
                        {checkInResult.success ? 'Attendance recorded' : 'Check-in rejected'}
                      </p>
                      <p className="text-xs text-fg-muted">{checkInResult.course} · {checkInResult.success ? 'All stages passed' : 'Failed at geofence stage'}</p>
                    </div>
                  </motion.div>
                )}

                {activeSession && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 border border-[var(--accent)] rounded-lg p-4 relative overflow-hidden"
                    style={{ background: 'var(--accent-soft)' }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl" style={{ background: 'var(--accent-soft)' }} />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-[10px] text-accent uppercase tracking-wider font-medium">Session Active Now</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-fg">{activeSession.courseCode}</h3>
                      <p className="text-xs text-fg-muted mb-3">{activeSession.courseTitle} · {activeSession.locationName}</p>
                      <Button size="sm" magnetic className="w-full" onClick={() => setView('checkin')}>
                        <QrCode className="w-4 h-4" /> Check In Now
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Card className="p-3 text-center">
                    <Flame className="w-5 h-5 text-accent mx-auto mb-1" />
                    <p className="font-display text-xl font-bold text-fg">12</p>
                    <p className="text-[10px] text-fg-dim">Day streak</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
                    <p className="font-display text-xl font-bold text-fg">94%</p>
                    <p className="text-[10px] text-fg-dim">Attendance</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <Clock className="w-5 h-5 text-fg-muted mx-auto mb-1" />
                    <p className="font-display text-xl font-bold text-fg">3</p>
                    <p className="text-[10px] text-fg-dim">Today's classes</p>
                  </Card>
                </div>

                <div className="mb-6">
                  <h2 className="text-xs text-fg-dim uppercase tracking-wider mb-3">Today's Classes</h2>
                  <div className="space-y-2">
                    {todayClasses.map((course, i) => (
                      <motion.div key={course.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card hover className="p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-bg-elevated-2 flex items-center justify-center text-accent">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-fg font-medium truncate">{course.code}</p>
                            <p className="text-xs text-fg-muted truncate">{course.title}</p>
                          </div>
                          <span className="text-xs text-fg-dim font-mono">{course.schedule.split(',')[1]}</span>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="md" onClick={() => setView('history')}>Attendance History</Button>
                  <Button variant="secondary" size="md" onClick={() => setView('profile')}>My Profile</Button>
                </div>
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div key="hist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setView('dashboard')} className="text-fg-dim hover:text-fg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h1 className="font-display text-xl font-bold text-fg">Attendance History</h1>
                </div>
                <div className="space-y-2">
                  {attendanceHistory.map((record, i) => (
                    <motion.div key={record.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Card hover className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm text-fg font-medium">{record.courseCode}</p>
                            <p className="text-xs text-fg-muted">{record.courseTitle}</p>
                          </div>
                          <Badge status={record.status} />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-[10px] text-fg-dim font-mono">
                            {new Date(record.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
                            {new Date(record.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                          {record.overallScore > 0 && <span className="text-[10px] font-mono text-success">{record.overallScore.toFixed(1)}%</span>}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {view === 'profile' && (
              <motion.div key="prof" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setView('dashboard')} className="text-fg-dim hover:text-fg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h1 className="font-display text-xl font-bold text-fg">My Profile</h1>
                </div>

                <Card className="p-6 mb-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-2xl font-bold text-white">{studentUser.avatar}</span>
                  </div>
                  <h2 className="font-display text-lg font-semibold text-fg">{studentUser.name}</h2>
                  <p className="text-xs text-fg-muted">{studentUser.email}</p>
                </Card>

                <Card className="p-5 mb-4">
                  <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-3">Academic Details</p>
                  <div className="space-y-2.5">
                    <Row label="Matric Number" value={studentUser.matric ?? '—'} />
                    <Row label="Department" value={studentUser.department ?? '—'} />
                    <Row label="Level" value={studentUser.level ?? '—'} />
                    <Row label="Enrolled Courses" value={`${studentUser.courses?.length ?? 0}`} />
                  </div>
                </Card>

                <Card className="p-5 mb-4">
                  <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-3">Registered Face Reference</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-bg-elevated-2 border border-border flex items-center justify-center text-fg-dim/30 font-display text-3xl">☻</div>
                    <div>
                      <p className="text-sm text-fg">Face template enrolled</p>
                      <p className="text-xs text-fg-muted">Registered Aug 12, 2026 · 128-point vector</p>
                      <div className="mt-1"><Badge status="passed" /></div>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-3">Semester Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-display text-2xl font-bold text-accent">94%</p>
                      <p className="text-xs text-fg-muted">Overall attendance</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-success">12</p>
                      <p className="text-xs text-fg-muted">Current streak (days)</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="sticky bottom-0 z-40 glass border-t border-border px-5 py-3">
          <div className="flex items-center justify-around">
            <NavButton icon={QrCode} label="Check In" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavButton icon={Calendar} label="History" active={view === 'history'} onClick={() => setView('history')} />
            <NavButton icon={Fingerprint} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-fg-muted">{label}</span>
      <span className="text-xs text-fg font-mono">{value}</span>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }: { icon: typeof QrCode; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={onClick} className={`flex flex-col items-center gap-1 px-4 py-1.5 transition-colors ${active ? 'text-accent' : 'text-fg-dim'}`}>
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </motion.button>
  );
}
