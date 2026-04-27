import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import { Loader2 } from 'lucide-react';

// Lazy-load all page-level components — each becomes its own chunk
const Home       = lazy(() => import('./pages/Home'));
const NoteEditor = lazy(() => import('./pages/NoteEditor'));
const NotFound   = lazy(() => import('./pages/NotFound'));
const Login      = lazy(() => import('./pages/Login'));
const Signup     = lazy(() => import('./pages/Signup'));
const Landing    = lazy(() => import('./pages/Landing'));
const Trash      = lazy(() => import('./pages/Trash'));
const SharedNote = lazy(() => import('./pages/SharedNote'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-base)',
    }}>
      <Loader2 size={24} style={{ color: 'var(--tx-muted)', animation: 'spin 1s linear infinite' }} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0d1117',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
            }}
          />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login"   element={<Login />} />
              <Route path="/signup"  element={<Signup />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/shared/:shareId" element={<SharedNote />} />

              <Route path="/" element={
                <ProtectedRoute fallback={<Landing />}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index                element={<Home />} />
                <Route path="note/:id"      element={<NoteEditor />} />
                <Route path="note/new"      element={<NoteEditor />} />
                <Route path="trash"         element={<Trash />} />
                <Route path="*"             element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
