import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import {
  Fingerprint, ShieldCheck, Users, Radio, TrendingUp, AlertTriangle, Search, X,
  QrCode, MapPin, ScanFace, Clock, CheckCircle2, XCircle, ChevronRight, Database, LayoutGrid, UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, StatCard } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AnimatedCounter } from '@/components/ui/Kinetic';
import { adminStats, students, lecturers, attendanceHistory, adminUser } from '@/data/mockData';

type View = 'overview' | 'records' | 'users';

const stageIcons: Record<string, typeof QrCode> = { qr: QrCode, gps: MapPin, facial: ScanFace, timestamp: Clock };
const stageLabels: Record<string, string> = { qr: 'QR Scan', gps: 'GPS Geofence', facial: 'Facial Match', timestamp: 'Timestamp' };

export function AdminPortal() {
  const [view, setView] = useState<View>('overview');
  const [selectedRecord, setSelectedRecord] = useState<typeof attendanceHistory[0] | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base dot-grid grain">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-fg leading-none">Smart Attendance</p>
              <p className="text-[10px] text-fg-dim">System Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Switch role</Button>
            <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border flex items-center justify-center">
              <span className="text-sm font-display text-fg">{adminUser.avatar}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        <aside className="w-56 flex-shrink-0 border-r border-border min-h-[calc(100vh-65px)] py-6 px-3 hidden md:block">
          <nav className="space-y-1">
            <SideButton icon={LayoutGrid} label="Overview" active={view === 'overview'} onClick={() => setView('overview')} />
            <SideButton icon={Database} label="Attendance Records" active={view === 'records'} onClick={() => setView('records')} />
            <SideButton icon={UserCog} label="User Management" active={view === 'users'} onClick={() => setView('users')} />
          </nav>
          <div className="mt-8 px-3">
            <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-fg-muted">All systems operational</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-6 py-8">
          <AnimatePresence mode="wait">
            {view === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="md:col-span-2 border border-[var(--danger)] rounded-lg p-6 relative overflow-hidden" style={{ background: 'var(--danger-soft)' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ background: 'var(--danger-soft)' }} />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-danger" />
                        <span className="text-xs text-danger uppercase tracking-wider font-medium">Fraud Prevented</span>
                      </div>
                      <p className="font-display text-5xl font-bold text-danger mb-2">
                        <AnimatedCounter value={adminStats.proxyAttemptsBlocked} />
                      </p>
                      <p className="text-sm text-fg-muted">Proxy attendance attempts blocked this semester across all verification stages</p>
                    </div>
                  </motion.div>
                  <StatCard label="Total Students" value={adminStats.totalStudents.toLocaleString()} icon={<Users className="w-5 h-5" />} accent="accent" />
                  <StatCard label="Active Sessions" value={adminStats.activeSessions} icon={<Radio className="w-5 h-5" />} accent="success" sublabel="Right now" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <StatCard label="System Attendance Rate" value={`${adminStats.systemAttendanceRate}%`} icon={<TrendingUp className="w-5 h-5" />} accent="success" />
                  <StatCard label="Total Lecturers" value={adminStats.totalLecturers} icon={<UserCog className="w-5 h-5" />} accent="fg" />
                  <StatCard label="Courses Tracked" value="42" icon={<Database className="w-5 h-5" />} accent="accent" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <Card className="p-6">
                    <h3 className="font-display text-sm font-semibold text-fg mb-4">Weekly Attendance Trend</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={adminStats.weeklyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={11} />
                          <YAxis stroke="var(--text-dim)" fontSize={11} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: 'var(--accent)' }} />
                          <Line type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-display text-sm font-semibold text-fg mb-4">Verification Stage Failures</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminStats.stageFailures} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                          <XAxis type="number" stroke="var(--text-dim)" fontSize={11} />
                          <YAxis type="category" dataKey="stage" stroke="var(--text-dim)" fontSize={11} width={90} />
                          <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: 'var(--danger)' }} cursor={{ fill: 'var(--danger-soft)' }} />
                          <Bar dataKey="failures" radius={[0, 4, 4, 0]}>
                            {adminStats.stageFailures.map((_, i) => (
                              <Cell key={i} fill={i === 1 ? 'var(--danger)' : 'var(--accent)'} fillOpacity={i === 1 ? 1 : 0.6} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="font-display text-sm font-semibold text-fg mb-4">Department Comparison — Attendance Rate</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adminStats.departmentComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="dept" stroke="var(--text-dim)" fontSize={11} />
                        <YAxis stroke="var(--text-dim)" fontSize={11} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: 'var(--success)' }} cursor={{ fill: 'var(--success-soft)' }} />
                        <Bar dataKey="rate" radius={[4, 4, 0, 0]} fill="var(--success)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>
            )}

            {view === 'records' && (
              <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-xl font-bold text-fg mb-6">Attendance Records</h2>
                <RecordsTable records={attendanceHistory} onSelect={setSelectedRecord} />
              </motion.div>
            )}

            {view === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-xl font-bold text-fg mb-6">User Management</h2>
                <UsersTable />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {selectedRecord && <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SideButton({ icon: Icon, label, active, onClick }: { icon: typeof LayoutGrid; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'text-accent border' : 'text-fg-dim hover:text-fg hover:bg-bg-elevated border border-transparent'}`} style={active ? { background: 'var(--accent-soft)', borderColor: 'var(--accent)' } : undefined}>
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  );
}

function RecordsTable({ records, onSelect }: { records: typeof attendanceHistory; onSelect: (r: typeof attendanceHistory[0]) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = records.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || r.matric.toLowerCase().includes(search.toLowerCase()) || r.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-dim" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student, matric, or course…" className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-fg focus:border-accent focus:outline-none transition-colors placeholder:text-fg-dim" />
        </div>
        <div className="flex gap-1">
          {['all', 'present', 'late', 'rejected'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2.5 rounded-lg text-xs font-medium capitalize border transition-colors ${statusFilter === s ? 'border-accent text-accent' : 'border-border bg-bg-elevated text-fg-dim hover:text-fg'}`} style={statusFilter === s ? { background: 'var(--accent-soft)' } : undefined}>{s}</button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium">Student</th>
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium">Course</th>
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium hidden md:table-cell">Date & Time</th>
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium">Status</th>
                <th className="text-right text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium hidden md:table-cell">Score</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ backgroundColor: 'var(--bg-elevated-2)' }} className="cursor-pointer" onClick={() => onSelect(r)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-elevated-2 flex items-center justify-center text-xs font-display text-fg">{r.studentName.split(' ').map(n => n[0]).join('')}</div>
                      <div><p className="text-sm text-fg">{r.studentName}</p><p className="text-xs text-fg-dim font-mono">{r.matric}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><p className="text-sm text-fg">{r.courseCode}</p><p className="text-xs text-fg-muted">{r.courseTitle}</p></td>
                  <td className="px-5 py-3 hidden md:table-cell"><p className="text-xs text-fg-muted font-mono">{new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p><p className="text-xs text-fg-dim font-mono">{new Date(r.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p></td>
                  <td className="px-5 py-3"><Badge status={r.status} /></td>
                  <td className="px-5 py-3 text-right hidden md:table-cell">{r.overallScore > 0 ? <span className="text-xs font-mono text-success">{r.overallScore.toFixed(1)}%</span> : <span className="text-xs text-fg-dim">—</span>}</td>
                  <td className="px-5 py-3"><ChevronRight className="w-4 h-4 text-fg-dim" /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center"><p className="text-sm text-fg-muted">No records match your filters.</p></div>}
      </Card>
    </div>
  );
}

function UsersTable() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const allUsers = [
    ...students.map((s) => ({ id: s.id, name: s.name, role: 'student' as const, email: `${s.matric.toLowerCase().replace(/[^a-z]/g, '')}@bouesti.edu.ng`, avatar: s.avatar, dept: s.department, sub: s.matric })),
    ...lecturers.map((l) => ({ id: l.id, name: l.name, role: 'lecturer' as const, email: l.email, avatar: l.avatar, dept: 'Computer Science', sub: l.courses?.join(', ') ?? '' })),
  ];

  const filtered = allUsers.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-dim" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-fg focus:border-accent focus:outline-none transition-colors placeholder:text-fg-dim" />
        </div>
        <div className="flex gap-1">
          {['all', 'student', 'lecturer'].map((s) => (
            <button key={s} onClick={() => setRoleFilter(s)} className={`px-3 py-2.5 rounded-lg text-xs font-medium capitalize border transition-colors ${roleFilter === s ? 'border-accent text-accent' : 'border-border bg-bg-elevated text-fg-dim hover:text-fg'}`} style={roleFilter === s ? { background: 'var(--accent-soft)' } : undefined}>{s}</button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium">User</th>
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium">Department</th>
                <th className="text-left text-[10px] text-fg-dim uppercase tracking-wider px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ backgroundColor: 'var(--bg-elevated-2)' }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-elevated-2 flex items-center justify-center text-xs font-display text-fg">{u.avatar}</div>
                      <div><p className="text-sm text-fg">{u.name}</p><p className="text-xs text-fg-dim font-mono">{u.sub}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell"><span className="text-xs text-fg-muted font-mono">{u.email}</span></td>
                  <td className="px-5 py-3"><span className="text-xs text-fg-muted">{u.dept}</span></td>
                  <td className="px-5 py-3"><span className={`text-xs font-medium capitalize ${u.role === 'lecturer' ? 'text-success' : 'text-accent'}`}>{u.role}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center"><p className="text-sm text-fg-muted">No users found.</p></div>}
      </Card>
    </div>
  );
}

function RecordDetailModal({ record, onClose }: { record: typeof attendanceHistory[0]; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg glass border border-border rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-1">Attendance Record</p>
            <h2 className="font-display text-xl font-bold text-fg">{record.courseCode}</h2>
            <p className="text-xs text-fg-muted">{record.courseTitle}</p>
          </div>
          <button onClick={onClose} className="text-fg-dim hover:text-fg transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-lg bg-bg-elevated-2 flex items-center justify-center font-display text-fg">{record.studentName.split(' ').map(n => n[0]).join('')}</div>
          <div><p className="text-sm text-fg">{record.studentName}</p><p className="text-xs text-fg-dim font-mono">{record.matric}</p></div>
          <div className="ml-auto"><Badge status={record.status} size="md" /></div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-1">Check-in Time</p>
          <p className="font-mono text-sm text-fg">{new Date(record.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>

        <p className="text-[10px] text-fg-dim uppercase tracking-wider mb-3">4-Stage Verification Breakdown</p>
        <div className="space-y-3">
          {record.stages.map((s, i) => {
            const Icon = stageIcons[s.stage];
            return (
              <motion.div key={s.stage} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-3 rounded-lg border border-border" style={{ background: 'var(--bg-elevated-2)' }}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.passed ? 'text-success' : 'text-danger'}`} style={{ background: s.passed ? 'var(--success-soft)' : 'var(--danger-soft)' }}><Icon className="w-5 h-5" /></div>
                <div className="flex-1"><p className="text-sm text-fg">{stageLabels[s.stage]}</p><p className="text-xs text-fg-muted">{s.detail}</p></div>
                {s.score !== undefined && s.score > 0 && <span className="text-xs font-mono text-success">{s.score.toFixed(1)}%</span>}
                {s.passed ? <CheckCircle2 className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-danger" />}
              </motion.div>
            );
          })}
        </div>

        {record.overallScore > 0 && (
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <span className="text-xs text-fg-dim uppercase tracking-wider">Overall Verification Score</span>
            <span className="font-display text-2xl font-bold text-gradient-success">{record.overallScore.toFixed(1)}%</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
