import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { authService } from '../services/auth';
import { usersService } from '../services/users';
import { Platform } from 'react-native';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, telefone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { nome?: string; telefone?: string; senha?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

 async function loadStoredAuth() {
    try {
      // Busca do SecureStore no celular, ou do localStorage na Web
      const storedToken = Platform.OS === 'web' 
        ? localStorage.getItem('auth-token')
        : await SecureStore.getItemAsync('auth-token');

      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await usersService.getProfile();
          setUser(profile);
        } catch {
          if (Platform.OS === 'web') {
            localStorage.removeItem('auth-token');
          } else {
            await SecureStore.deleteItemAsync('auth-token');
          }
          setToken(null);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar token inicial:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, senha: string) {
    const response = await authService.login(email, senha);
    
    if (Platform.OS === 'web') {
      localStorage.setItem('auth-token', response.token);
    } else {
      await SecureStore.setItemAsync('auth-token', response.token);
    }

    setToken(response.token);
    setUser(response.user);
  }

  async function register(nome: string, email: string, senha: string, telefone: string) {
    const response = await authService.register(nome, email, senha, telefone);
    
    if (Platform.OS === 'web') {
      localStorage.setItem('auth-token', response.token);
    } else {
      await SecureStore.setItemAsync('auth-token', response.token);
    }

    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    if (Platform.OS === 'web') {
      localStorage.removeItem('auth-token');
    } else {
      await SecureStore.deleteItemAsync('auth-token');
    }
    setToken(null);
    setUser(null);
  }

  async function updateProfile(data: { nome?: string; telefone?: string; senha?: string }) {
    const updatedUser = await usersService.updateProfile(data);
    setUser(updatedUser);
  }

  async function deleteAccount() {
    await usersService.deleteProfile();
    await SecureStore.deleteItemAsync('auth-token');
    setToken(null);
    setUser(null);
  }

  async function refreshProfile() {
    if (token) {
      try {
        const profile = await usersService.getProfile();
        setUser(profile);
      } catch {
        await logout();
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}