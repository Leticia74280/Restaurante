
import { useState, useEffect } from 'react';
import { authStore } from '../store/authStore';

export function useAuth() {
  const [user, setUser] = useState(authStore.user);
  const [isAuthenticated, setIsAuthenticated] = useState(authStore.isAuthenticated);

  useEffect(() => {
    authStore.init();
    
    const unsubscribe = authStore.subscribe(() => {
      setUser(authStore.user);
      setIsAuthenticated(authStore.isAuthenticated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    login: authStore.login.bind(authStore),
    register: authStore.register.bind(authStore),
    logout: authStore.logout.bind(authStore)
  };
}
