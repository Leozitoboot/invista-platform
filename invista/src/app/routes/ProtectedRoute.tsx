import { Navigate, useLocation } from 'react-router-dom';
import AuthMockService from '../../shared/services/AuthMockService';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!AuthMockService.isAuthenticated()) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return <>{children}</>;
}
