import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  });
  const [displayName, setDisplayName] = useState('Anonymous');
  const [preferences, setPreferences] = useState({
    theme: 'light',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user_profile');
      const savedPermissions = await AsyncStorage.getItem('permissions');
      const savedDisplayName = await AsyncStorage.getItem('display_name');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedPermissions) setPermissions(JSON.parse(savedPermissions));
      if (savedDisplayName) setDisplayName(savedDisplayName);
    } catch (e) {
      console.error('Failed to load user data:', e);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate login - in production, call your backend
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        createdAt: new Date().toISOString(),
      };

      const token = 'mock_token_' + Math.random().toString(36).substr(2, 9);
      await SecureStore.setItemAsync('auth_token', token);
      await AsyncStorage.setItem('user_profile', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (e) {
      console.error('Login failed:', e);
      return { success: false, error: e.message };
    }
  };

  const signup = async (email, password) => {
    try {
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        createdAt: new Date().toISOString(),
      };

      const token = 'mock_token_' + Math.random().toString(36).substr(2, 9);
      await SecureStore.setItemAsync('auth_token', token);
      await AsyncStorage.setItem('user_profile', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (e) {
      console.error('Signup failed:', e);
      return { success: false, error: e.message };
    }
  };

  const updatePermissions = async (newPermissions) => {
    try {
      setPermissions(newPermissions);
      await AsyncStorage.setItem('permissions', JSON.stringify(newPermissions));
    } catch (e) {
      console.error('Failed to update permissions:', e);
    }
  };

  const updateDisplayName = async (name) => {
    try {
      setDisplayName(name);
      await AsyncStorage.setItem('display_name', name);
    } catch (e) {
      console.error('Failed to update display name:', e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await AsyncStorage.removeItem('user_profile');
      setUser(null);
      return { success: true };
    } catch (e) {
      console.error('Logout failed:', e);
      return { success: false, error: e.message };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        permissions,
        displayName,
        preferences,
        login,
        signup,
        logout,
        updatePermissions,
        updateDisplayName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};