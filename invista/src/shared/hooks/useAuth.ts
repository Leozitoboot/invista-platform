import { useState, useCallback } from 'react';
import AuthMockService from '../services/AuthMockService';

export function useAuth() {
  const [session, setSession] = useState(() => AuthMockService.getSession());

  const login = useCallback(async (email: string, password: string) => {
    const s = await AuthMockService.login(email, password);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(() => {
    AuthMockService.logout();
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  };
}
