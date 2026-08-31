import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import {
  Fingerprint, QrCode, MapPin, ScanFace, Clock, Plus, Users, Activity, ArrowLeft,
  CheckCircle2, XCircle, Radio, BarChart3, Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, StatCard } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { lecturers, courses, students, sessions, courseAnalytics } from '@/data/mockData';

type View = 'dashboard' | 'create' | 'monitor' | 'reports';

interface LiveCheckIn {
  id: string;
  studentName: string;
  matric: string;
  avatar: string;
  stages: { stage: string; passed: boolean }[];
  status: 'present' | 'late' | 'rejected';
  time: string;
}

const stageIcons: Record<string, typeof QrCode> = { qr: QrCode, gps: MapPin, facial: ScanFace, timestamp: Clock };

export function LecturerPortal() {
  const [view, setView] = useState<View>('dashboard');
  const [activeSession, setActiveSession] = useState<typeof sessions[0] | null>(null);
  const [liveCheckIns, setLiveCheckIns] = useState<LiveCheckIn[]>([]);
  const navigate = useNavigate();

  const lecturer = lecturers[0];
  const lecturerCourses = courses.filter((c) => c.lecturerId === lecturer.id);

  useEffect(() => {
    if (view !== 'monitor' || !activeSession) return;

    const checkInSequence: Omit<LiveCheckIn, 'id' | 'time'>[] = students.slice(0, 8).map((s, i) => ({
      studentName: s.name,
      matric: s.matric,
      avatar: s.avatar,
      stages: [
        { stage: 'qr', passed: true },
        { stage: 'gps', passed: i !== 3 },
        { stage: 'facial', passed: i !== 3 },
        { stage: 'timestamp', passed: i !== 3 },
      ],
      status: i === 3 ? 'rejected' : i === 5 ? 'late' : 'present',
    }));

    let index = 0;
    const interval = setInterval(() => {
      if (index >= checkInSequence.length) {
        clearInterval(interval);
        return;
      }
      const now = new Date();
      setLiveCheckIns((prev) => [
        ...prev,
        { ...checkInSequence[index], id: `ci-${index}`, time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) },
      ]);
      index++;
    }, 1800);

    return () => clearInterval(interval);
  }, [view, activeSession]);

  const startSession = (course: typeof courses[0]) => {
    const newSession = {
      ...sessions[0],
      id: `ses-${Date.now()}`,
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      status: 'active' as const,
      startedAt: new Date().toISOString(),
    };
    setActiveSession(newSession);
    setLiveCheckIns([]);
    setView('monitor');
  };

  return (
    <div className="min-h-screen bg-bg-base dot-grid grain">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-fg leading-none">Smart Attendance</p>
              <p className="text-[10px] text-fg-dim">Lecturer Console · {lecturer.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Switch role</Button>
            <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border flex items-center justify-center">
              <span className="text-sm font-display text-fg">{lecturer.avatar}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
          <TabButton icon={Activity} label="Overview" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <TabButton icon={Plus} label="Create Session" active={view === 'create'} onClick={() => setView('create')} />
          <TabButton icon={Radio} label="Live Monitor" active={view === 'monitor'} onClick={() => activeSession ? setView('monitor') : setView('create')} />
          <TabButton icon={BarChart3} label="Reports" active={view === 'reports'} onClick={() => setView('reports')} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="My Courses" value={lecturerCourses.length} icon={<Settings className="w-5 h-5" />} accent="accent" />
                <StatCard label="Active Sessions" value={activeSession?.status === 'active' ? 1 : 0} icon={<Radio className="w-5 h-5" />} accent="success" />
                <StatCard label="Total Students" value={lecturerCourses.reduce((a, c) => a + c.totalStudents, 0)} icon={<Users className="w-5 h-5" />} accent="fg" />
                <StatCard label="Avg Attendance" value="89%" icon={<BarChart3 className="w-5 h-5" />} accent="accent" />
              </div>

              <h2 className="font-display text-lg font-semibold text-fg mb-4">Your Courses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {lecturerCourses.map((course, i) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                    <Card hover className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display text-base font-semibold text-fg">{course.code}</h3>
                          <p className="text-xs text-fg-muted">{course.title}</p>
                        </div>
                        <Badge status="info">{`${course.totalStudents} students`}</Badge>
                      </div>
                      <p className="text-xs text-fg-muted mb-4">{course.schedule}</p>
                      <Button size="sm" className="w-full" onClick={() => startSession(course)}>
                        <Plus className="w-3.5 h-3.5" /> Start Session
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <CreateSession lecturerCourses={lecturerCourses} onCreate={startSession} />
            </motion.div>
          )}

          {view === 'monitor' && activeSession && (
            <motion.div key="monitor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LiveMonitor session={activeSession} checkIns={liveCheckIns} onEnd={() => { setActiveSession(null); setView('dashboard'); }} />
            </motion.div>
          )}

          {view === 'monitor' && !activeSession && (
            <motion.div key="no-session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="p-12 text-center">
                <Radio className="w-12 h-12 text-fg-dim mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-fg mb-2">No active session</h3>
                <p className="text-sm text-fg-muted mb-6">Create a new session to start monitoring live check-ins.</p>
                <Button onClick={() => setView('create')}><Plus className="w-4 h-4" /> Create Session</Button>
              </Card>
            </motion.div>
          )}

          {view === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ReportsView lecturerCourses={lecturerCourses} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: { icon: typeof Activity; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${active ? 'border-accent text-accent' : 'border-transparent text-fg-dim hover:text-fg'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function CreateSession({ lecturerCourses, onCreate }: { lecturerCourses: typeof courses; onCreate: (c: typeof courses[0]) => void }) {
  const [selectedCourse, setSelectedCourse] = useState(lecturerCourses[0]);
  const [duration, setDuration] = useState(15);
  const [geofenceRadius, setGeofenceRadius] = useState(50);
  const [location, setLocation] = useState('LT 3 — Engineering Block');
  const [step, setStep] = useState<'config' | 'qr'>('config');

  if (step === 'qr') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('config')} className="text-fg-dim hover:text-fg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="font-display text-xl font-bold text-fg">Session QR Code</h2>
        </div>
        <Card className="p-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block p-6 rounded-lg mb-6" style={{ background: 'var(--text)' }}>
            <div className="grid grid-cols-12 gap-0.5">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className={`w-3 h-3 ${Math.random() > 0.45 ? 'bg-[var(--bg)]' : 'bg-transparent'}`} />
              ))}
            </div>
          </motion.div>
          <h3 className="font-display text-lg font-semibold text-fg mb-1">{selectedCourse.code}</h3>
          <p className="text-xs text-fg-muted mb-6">{selectedCourse.title}</p>
          <div className="grid grid-cols-3 gap-3 mb-6 text-left">
            <div><p className="text-[10px] text-fg-dim uppercase tracking-wider">Duration</p><p className="text-sm text-fg font-mono">{duration} min</p></div>
            <div><p className="text-[10px] text-fg-dim uppercase tracking-wider">Geofence</p><p className="text-sm text-fg font-mono">{geofenceRadius}m</p></div>
            <div><p className="text-[10px] text-fg-dim uppercase tracking-wider">Location</p><p className="text-sm text-fg truncate">{location.split('—')[0]}</p></div>
          </div>
          <Button size="lg" className="w-full" magnetic onClick={() => onCreate(selectedCourse)}>
            <Radio className="w-4 h-4" /> Start Live Session
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-xl font-bold text-fg mb-6">Create Attendance Session</h2>
      <Card className="p-6 space-y-5">
        <div>
          <label className="text-xs text-fg-dim uppercase tracking-wider mb-2 block">Course</label>
          <div className="space-y-2">
            {lecturerCourses.map((c) => (
              <button key={c.id} onClick={() => setSelectedCourse(c)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${selectedCourse.id === c.id ? 'border-accent' : 'border-border bg-bg-elevated-2 hover:border-border-hover'}`} style={selectedCourse.id === c.id ? { background: 'var(--accent-soft)' } : undefined}>
                <div><p className="text-sm text-fg">{c.code}</p><p className="text-xs text-fg-muted">{c.title}</p></div>
                {selectedCourse.id === c.id && <CheckCircle2 className="w-4 h-4 text-accent" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-fg-dim uppercase tracking-wider mb-2 block">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-bg-elevated-2 border border-border rounded-lg px-3 py-2.5 text-sm text-fg focus:border-accent focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="text-xs text-fg-dim uppercase tracking-wider mb-2 block">Session Duration: {duration} min</label>
          <input type="range" min="5" max="60" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
        </div>
        <div>
          <label className="text-xs text-fg-dim uppercase tracking-wider mb-2 block">Geofence Radius: {geofenceRadius}m</label>
          <input type="range" min="20" max="200" value={geofenceRadius} onChange={(e) => setGeofenceRadius(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
          <div className="mt-3 bg-bg-elevated-2 border border-border rounded-lg p-4 flex items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-full max-w-xs">
              <rect x="40" y="30" width="50" height="30" fill="var(--bg-elevated-3)" stroke="var(--border)" strokeWidth="1" rx="3" />
              <rect x="110" y="40" width="50" height="40" fill="var(--bg-elevated-3)" stroke="var(--border)" strokeWidth="1" rx="3" />
              <motion.circle cx="100" cy="60" r={geofenceRadius * 0.3} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              <circle cx="100" cy="60" r="4" fill="var(--accent)" />
              <motion.circle cx="100" cy="60" r="4" fill="none" stroke="var(--accent)" strokeWidth="1.5" animate={{ r: [4, 12], opacity: [0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </svg>
          </div>
        </div>
        <Button size="lg" className="w-full" magnetic onClick={() => setStep('qr')}>Generate QR Code <QrCode className="w-4 h-4" /></Button>
      </Card>
    </div>
  );
}

function LiveMonitor({ session, checkIns, onEnd }: { session: typeof sessions[0]; checkIns: LiveCheckIn[]; onEnd: () => void }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const presentCount = checkIns.filter((c) => c.status === 'present').length;
  const lateCount = checkIns.filter((c) => c.status === 'late').length;
  const rejectedCount = checkIns.filter((c) => c.status === 'rejected').length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-accent uppercase tracking-wider font-medium">Live Session</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-fg">{session.courseCode}</h2>
          <p className="text-xs text-fg-muted">{session.courseTitle} · {session.locationName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-lg text-fg">{Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-fg-dim">Elapsed</p>
          </div>
          <Button variant="danger" size="sm" onClick={onEnd}>End Session</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Checked In" value={`${checkIns.length}/${session.total}`} icon={<Users className="w-5 h-5" />} accent="accent" />
        <StatCard label="Present" value={presentCount} icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <StatCard label="Late" value={lateCount} icon={<Clock className="w-5 h-5" />} accent="accent" />
        <StatCard label="Rejected" value={rejectedCount} icon={<XCircle className="w-5 h-5" />} accent="danger" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-fg">Live Check-ins</h3>
          <span className="text-xs text-fg-dim">Real-time stream</span>
        </div>
        {checkIns.length === 0 ? (
          <div className="p-12 text-center">
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              <Radio className="w-10 h-10 text-fg-dim mx-auto mb-3" />
            </motion.div>
            <p className="text-sm text-fg-muted">Waiting for students to check in…</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            <AnimatePresence>
              {checkIns.slice().reverse().map((ci) => (
                <motion.div key={ci.id} initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-elevated-2 flex items-center justify-center text-xs font-display text-fg flex-shrink-0">{ci.avatar}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm text-fg truncate">{ci.studentName}</p><p className="text-xs text-fg-dim font-mono">{ci.matric}</p></div>
                  <div className="hidden md:flex items-center gap-1.5">
                    {ci.stages.map((s) => {
                      const Icon = stageIcons[s.stage];
                      return <div key={s.stage} className={`w-6 h-6 rounded flex items-center justify-center ${s.passed ? 'text-success' : 'text-danger'}`} style={{ background: s.passed ? 'var(--success-soft)' : 'var(--danger-soft)' }}><Icon className="w-3.5 h-3.5" /></div>;
                    })}
                  </div>
                  <Badge status={ci.status} />
                  <span className="text-xs text-fg-dim font-mono hidden sm:block">{ci.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  );
}

function ReportsView({ lecturerCourses }: { lecturerCourses: typeof courses }) {
  const [selectedCourse, setSelectedCourse] = useState(lecturerCourses[0]);
  const analytics = courseAnalytics[selectedCourse.id] ?? [];

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-fg mb-6">Attendance Reports</h2>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {lecturerCourses.map((c) => (
          <button key={c.id} onClick={() => setSelectedCourse(c)} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors ${selectedCourse.id === c.id ? 'border-accent text-accent' : 'border-border bg-bg-elevated text-fg-dim hover:text-fg'}`} style={selectedCourse.id === c.id ? { background: 'var(--accent-soft)' } : undefined}>{c.code}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Sessions Held" value={analytics.length} accent="accent" />
        <StatCard label="Avg Attendance" value={`${Math.round(analytics.reduce((a, s) => a + s.rate, 0) / (analytics.length || 1))}%`} accent="success" />
        <StatCard label="Total Students" value={selectedCourse.totalStudents} accent="fg" />
      </div>
      <Card className="p-6">
        <h3 className="font-display text-sm font-semibold text-fg mb-4">Attendance Rate Trend — {selectedCourse.code}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="session" stroke="var(--text-dim)" fontSize={11} />
              <YAxis stroke="var(--text-dim)" fontSize={11} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: 'var(--accent)' }} />
              <Line type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
