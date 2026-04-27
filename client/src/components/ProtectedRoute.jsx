import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, fallback }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
        <Loader2 size={28} style={{ color: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return fallback ? fallback : <Navigate to="/login" replace />;
  }

  return children;
}
