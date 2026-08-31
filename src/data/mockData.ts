export type Role = 'student' | 'lecturer' | 'admin';

export type AttendanceStatus = 'present' | 'late' | 'rejected' | 'pending';

export type VerificationStage = 'qr' | 'gps' | 'facial' | 'timestamp';

export interface StageResult {
  stage: VerificationStage;
  passed: boolean;
  detail: string;
  score?: number;
}

export interface Student {
  id: string;
  name: string;
  matric: string;
  department: string;
  level: string;
  avatar: string;
  streak: number;
  attendanceRate: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  lecturerId: string;
  lecturerName: string;
  schedule: string;
  totalStudents: number;
}

export interface Session {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerName: string;
  status: 'active' | 'ended';
  startedAt: string;
  durationMin: number;
  geofenceRadius: number;
  locationName: string;
  checkedIn: number;
  total: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  courseCode: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  matric: string;
  status: AttendanceStatus;
  timestamp: string;
  stages: StageResult[];
  overallScore: number;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
  matric?: string;
  department?: string;
  level?: string;
  courses?: string[];
}

export const students: Student[] = [
  { id: 's1', name: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', department: 'Computer Science', level: '400L', avatar: 'AO', streak: 12, attendanceRate: 94 },
  { id: 's2', name: 'Babatunde Ibrahim', matric: 'CSC/2021/0337', department: 'Computer Science', level: '400L', avatar: 'BI', streak: 8, attendanceRate: 88 },
  { id: 's3', name: 'Fatima Bello', matric: 'CSC/2021/0512', department: 'Computer Science', level: '400L', avatar: 'FB', streak: 15, attendanceRate: 97 },
  { id: 's4', name: 'Chukwuemeka Okafor', matric: 'CSC/2021/0274', department: 'Computer Science', level: '400L', avatar: 'CO', streak: 3, attendanceRate: 71 },
  { id: 's5', name: 'Zainab Yusuf', matric: 'CSC/2021/0619', department: 'Computer Science', level: '400L', avatar: 'ZY', streak: 21, attendanceRate: 99 },
  { id: 's6', name: 'Daniel Eze', matric: 'CSC/2021/0158', department: 'Computer Science', level: '400L', avatar: 'DE', streak: 0, attendanceRate: 62 },
  { id: 's7', name: 'Hauwa Suleiman', matric: 'CSC/2021/0723', department: 'Computer Science', level: '400L', avatar: 'HS', streak: 7, attendanceRate: 85 },
  { id: 's8', name: 'Tunde Bakare', matric: 'CSC/2021/0405', department: 'Computer Science', level: '400L', avatar: 'TB', streak: 5, attendanceRate: 79 },
  { id: 's9', name: 'Ngozi Obi', matric: 'CSC/2021/0891', department: 'Computer Science', level: '400L', avatar: 'NO', streak: 11, attendanceRate: 92 },
  { id: 's10', name: 'Sani Mohammed', matric: 'CSC/2021/0112', department: 'Computer Science', level: '400L', avatar: 'SM', streak: 2, attendanceRate: 68 },
  { id: 's11', name: 'Grace Adeyemi', matric: 'CSC/2021/0567', department: 'Computer Science', level: '400L', avatar: 'GA', streak: 9, attendanceRate: 90 },
  { id: 's12', name: 'Ibrahim Sani', matric: 'CSC/2021/0348', department: 'Computer Science', level: '400L', avatar: 'IS', streak: 6, attendanceRate: 83 },
];

export const courses: Course[] = [
  { id: 'c1', code: 'CSC 401', title: 'Distributed Systems', department: 'Computer Science', lecturerId: 'l1', lecturerName: 'Dr. Nwosu', schedule: 'Mon, 10:00 AM', totalStudents: 12 },
  { id: 'c2', code: 'CSC 403', title: 'Computer Vision', department: 'Computer Science', lecturerId: 'l1', lecturerName: 'Dr. Nwosu', schedule: 'Wed, 2:00 PM', totalStudents: 12 },
  { id: 'c3', code: 'CSC 405', title: 'Software Engineering', department: 'Computer Science', lecturerId: 'l2', lecturerName: 'Prof. Adebayo', schedule: 'Tue, 12:00 PM', totalStudents: 12 },
  { id: 'c4', code: 'CSC 407', title: 'Cryptography & Network Security', department: 'Computer Science', lecturerId: 'l2', lecturerName: 'Prof. Adebayo', schedule: 'Thu, 4:00 PM', totalStudents: 12 },
  { id: 'c5', code: 'CSC 409', title: 'Machine Learning', department: 'Computer Science', lecturerId: 'l3', lecturerName: 'Dr. Eze', schedule: 'Fri, 10:00 AM', totalStudents: 12 },
];

export const lecturers: User[] = [
  { id: 'l1', name: 'Dr. Nwosu', role: 'lecturer', email: 'nwosu@uni.edu.ng', avatar: 'DN', courses: ['CSC 401', 'CSC 403'] },
  { id: 'l2', name: 'Prof. Adebayo', role: 'lecturer', email: 'adebayo@uni.edu.ng', avatar: 'PA', courses: ['CSC 405', 'CSC 407'] },
  { id: 'l3', name: 'Dr. Eze', role: 'lecturer', email: 'eze@uni.edu.ng', avatar: 'DE', courses: ['CSC 409'] },
];

export const adminUser: User = {
  id: 'a1', name: 'System Admin', role: 'admin', email: 'admin@uni.edu.ng', avatar: 'SA',
};

export const studentUser: User = {
  id: 's1', name: 'Adaeze Okonkwo', role: 'student', email: 'adaeze@uni.edu.ng', avatar: 'AO',
  matric: 'CSC/2021/0481', department: 'Computer Science', level: '400L',
  courses: ['CSC 401', 'CSC 403', 'CSC 405'],
};

export const sessions: Session[] = [
  {
    id: 'ses1', courseId: 'c1', courseCode: 'CSC 401', courseTitle: 'Distributed Systems',
    lecturerName: 'Dr. Nwosu', status: 'active', startedAt: '2026-08-31T10:00:00',
    durationMin: 15, geofenceRadius: 50, locationName: 'LT 3 — Engineering Block',
    checkedIn: 8, total: 12,
  },
  {
    id: 'ses2', courseId: 'c3', courseCode: 'CSC 405', courseTitle: 'Software Engineering',
    lecturerName: 'Prof. Adebayo', status: 'ended', startedAt: '2026-08-30T12:00:00',
    durationMin: 15, geofenceRadius: 40, locationName: 'LT 7 — Sciences',
    checkedIn: 10, total: 12,
  },
  {
    id: 'ses3', courseId: 'c2', courseCode: 'CSC 403', courseTitle: 'Computer Vision',
    lecturerName: 'Dr. Nwosu', status: 'ended', startedAt: '2026-08-28T14:00:00',
    durationMin: 15, geofenceRadius: 50, locationName: 'Lab 4 — Computing',
    checkedIn: 11, total: 12,
  },
];

function makeStages(status: AttendanceStatus): StageResult[] {
  if (status === 'present') {
    return [
      { stage: 'qr', passed: true, detail: 'QR decoded — session CSC 401 verified' },
      { stage: 'gps', passed: true, detail: '12.3m inside geofence', score: 100 },
      { stage: 'facial', passed: true, detail: 'Face match confirmed', score: 98.4 },
      { stage: 'timestamp', passed: true, detail: 'Checked in 3 min after session start' },
    ];
  }
  if (status === 'late') {
    return [
      { stage: 'qr', passed: true, detail: 'QR decoded — session CSC 401 verified' },
      { stage: 'gps', passed: true, detail: '8.1m inside geofence', score: 100 },
      { stage: 'facial', passed: true, detail: 'Face match confirmed', score: 96.2 },
      { stage: 'timestamp', passed: true, detail: 'Late check-in — 6 min after grace period' },
    ];
  }
  if (status === 'rejected') {
    return [
      { stage: 'qr', passed: true, detail: 'QR decoded — session CSC 401 verified' },
      { stage: 'gps', passed: false, detail: '340m outside geofence boundary', score: 0 },
      { stage: 'facial', passed: false, detail: 'Not evaluated', score: 0 },
      { stage: 'timestamp', passed: false, detail: 'Not evaluated' },
    ];
  }
  return [];
}

export const attendanceHistory: AttendanceRecord[] = [
  { id: 'r1', sessionId: 'ses2', courseCode: 'CSC 405', courseTitle: 'Software Engineering', studentId: 's1', studentName: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', status: 'present', timestamp: '2026-08-30T12:03:00', stages: makeStages('present'), overallScore: 99.1 },
  { id: 'r2', sessionId: 'ses3', courseCode: 'CSC 403', courseTitle: 'Computer Vision', studentId: 's1', studentName: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', status: 'present', timestamp: '2026-08-28T14:02:00', stages: makeStages('present'), overallScore: 98.7 },
  { id: 'r3', sessionId: 'ses_prev1', courseCode: 'CSC 401', courseTitle: 'Distributed Systems', studentId: 's1', studentName: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', status: 'late', timestamp: '2026-08-25T10:09:00', stages: makeStages('late'), overallScore: 96.2 },
  { id: 'r4', sessionId: 'ses_prev2', courseCode: 'CSC 407', courseTitle: 'Cryptography & Network Security', studentId: 's1', studentName: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', status: 'present', timestamp: '2026-08-22T16:01:00', stages: makeStages('present'), overallScore: 99.5 },
  { id: 'r5', sessionId: 'ses_prev3', courseCode: 'CSC 405', courseTitle: 'Software Engineering', studentId: 's1', studentName: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', status: 'rejected', timestamp: '2026-08-20T12:15:00', stages: makeStages('rejected'), overallScore: 0 },
  { id: 'r6', sessionId: 'ses_prev4', courseCode: 'CSC 401', courseTitle: 'Distributed Systems', studentId: 's1', studentName: 'Adaeze Okonkwo', matric: 'CSC/2021/0481', status: 'present', timestamp: '2026-08-18T10:02:00', stages: makeStages('present'), overallScore: 98.9 },
];

export const adminStats = {
  totalStudents: 1248,
  totalLecturers: 86,
  activeSessions: 7,
  systemAttendanceRate: 91.4,
  proxyAttemptsBlocked: 143,
  weeklyTrend: [
    { day: 'Mon', rate: 89 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 87 },
    { day: 'Thu', rate: 94 },
    { day: 'Fri', rate: 91 },
    { day: 'Sat', rate: 78 },
    { day: 'Sun', rate: 0 },
  ],
  stageFailures: [
    { stage: 'QR Scan', failures: 12 },
    { stage: 'GPS Geofence', failures: 67 },
    { stage: 'Facial Match', failures: 41 },
    { stage: 'Timestamp', failures: 23 },
  ],
  departmentComparison: [
    { dept: 'Comp. Sci', rate: 94 },
    { dept: 'Electrical', rate: 88 },
    { dept: 'Mechanical', rate: 85 },
    { dept: 'Civil', rate: 91 },
    { dept: 'Chemical', rate: 87 },
  ],
};

export const courseAnalytics: Record<string, { session: string; rate: number }[]> = {
  c1: [
    { session: 'Aug 18', rate: 92 }, { session: 'Aug 25', rate: 88 }, { session: 'Aug 28', rate: 95 }, { session: 'Aug 31', rate: 91 },
  ],
  c2: [
    { session: 'Aug 20', rate: 85 }, { session: 'Aug 24', rate: 90 }, { session: 'Aug 28', rate: 94 },
  ],
  c3: [
    { session: 'Aug 19', rate: 87 }, { session: 'Aug 23', rate: 91 }, { session: 'Aug 30', rate: 83 },
  ],
};

export const allUsers: User[] = [
  studentUser,
  ...lecturers,
  adminUser,
];

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}
