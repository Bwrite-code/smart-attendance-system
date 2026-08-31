import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { StudentPortal } from '@/pages/StudentPortal';
import { LecturerPortal } from '@/pages/LecturerPortal';
import { AdminPortal } from '@/pages/AdminPortal';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/lecturer" element={<LecturerPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
