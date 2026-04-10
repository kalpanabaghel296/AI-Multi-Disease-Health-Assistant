import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token,   setToken]   = useState(null);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app launch
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('@auth_token'),
          AsyncStorage.getItem('@user_info'),
        ]);

        if (storedToken) setToken(storedToken);
        if (storedUser)  setUser(JSON.parse(storedUser));

      } catch (e) {
        console.warn('Auth restore error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ FIXED LOGIN
const login = async (email, password) => {
  const data = await authService.login(email, password);

  console.log("LOGIN RESPONSE:", data);

  // Backend returns { access_token, token_type }
  const access_token = data.access_token;

  if (!access_token) {
    throw new Error("Token not received from server");
  }

  // Save token
  await AsyncStorage.setItem('@auth_token', access_token);
  setToken(access_token);

  // Save user info (backend doesn't return user object, derive from email)
  const info = { username: email.split('@')[0], email };
  setUser(info);
  await AsyncStorage.setItem('@user_info', JSON.stringify(info));
};

  const register = async (username, email, password) => {
    await authService.register(username, email, password);

    // Save basic user info
    await AsyncStorage.setItem('@user_info', JSON.stringify({ username, email }));
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['@auth_token', '@user_info']);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);