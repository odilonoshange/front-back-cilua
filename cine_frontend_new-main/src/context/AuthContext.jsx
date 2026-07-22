import { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authApi } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we wanted to validate the token on load, we'd do it here.
    // For now, if we have a token, we assume it's valid until an API call fails with 401.
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const { token: newToken, user: newUser } = response.data;
    setUser(newUser);
    setToken(newToken);
    return response.data;
  };

  const register = async (data) => {
    const response = await authApi.register(data);
    const { token: newToken, user: newUser } = response.data;
    setUser(newUser);
    setToken(newToken);
    return response.data;
  };

  const registerStudio = async (data) => {
    const response = await authApi.registerStudio(data);
    const { token: newToken, user: newUser } = response.data;
    setUser(newUser);
    setToken(newToken);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    registerStudio,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
