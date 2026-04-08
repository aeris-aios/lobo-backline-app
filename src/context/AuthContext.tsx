import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { SecureStorage } from '../utils/storage';
import { User } from '../types';

// -----------------------------------------------------------
// State
// -----------------------------------------------------------
interface AuthState {
  firebaseUser: FirebaseUser | null;
  appUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  biometricAvailable: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { firebaseUser: FirebaseUser; appUser?: User } }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BIOMETRIC_AVAILABLE'; payload: boolean }
  | { type: 'SET_APP_USER'; payload: User };

const initialState: AuthState = {
  firebaseUser: null,
  appUser: null,
  isLoading: true,
  isAuthenticated: false,
  biometricAvailable: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        firebaseUser: action.payload.firebaseUser,
        appUser: action.payload.appUser ?? null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_USER':
      return { ...initialState, isLoading: false, biometricAvailable: state.biometricAvailable };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_BIOMETRIC_AVAILABLE':
      return { ...state, biometricAvailable: action.payload };
    case 'SET_APP_USER':
      return { ...state, appUser: action.payload };
    default:
      return state;
  }
}

// -----------------------------------------------------------
// Context
// -----------------------------------------------------------
interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutEverywhere: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  devLogin: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// -----------------------------------------------------------
// Provider
// -----------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check biometric hardware on mount
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      dispatch({ type: 'SET_BIOMETRIC_AVAILABLE', payload: compatible && enrolled });
    })();
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const sessionValid = await SecureStorage.isSessionValid();
        const rememberMe = await SecureStorage.getRememberMe();

        if (!sessionValid && !rememberMe) {
          await AuthService.logout();
          dispatch({ type: 'CLEAR_USER' });
          return;
        }

        dispatch({ type: 'SET_USER', payload: { firebaseUser } });
      } else {
        dispatch({ type: 'CLEAR_USER' });
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const firebaseUser = await AuthService.login(email, password, rememberMe);
      dispatch({ type: 'SET_USER', payload: { firebaseUser } });
    } catch (error: any) {
      const message = mapFirebaseError(error.code ?? error.message);
      dispatch({ type: 'SET_ERROR', payload: message });
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const firebaseUser = await AuthService.register(email, password, firstName, lastName);
      dispatch({ type: 'SET_USER', payload: { firebaseUser } });
    } catch (error: any) {
      const message = mapFirebaseError(error.code ?? error.message);
      dispatch({ type: 'SET_ERROR', payload: message });
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  const logoutEverywhere = useCallback(async () => {
    await AuthService.logoutEverywhere();
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await AuthService.forgotPassword(email);
  }, []);

  const loginWithBiometric = useCallback(async () => {
    const biometricEnabled = await SecureStorage.getBiometricEnabled();
    if (!biometricEnabled) throw new Error('Biometric login is not enabled');

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access LOBO EP',
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });

    if (!result.success) throw new Error('Biometric authentication failed');

    // Re-authenticate using stored session
    const token = await SecureStorage.getToken();
    if (!token) throw new Error('No stored session found');

    const user = AuthService.getCurrentUser();
    if (user) {
      dispatch({ type: 'SET_USER', payload: { firebaseUser: user } });
    } else {
      throw new Error('Session expired. Please log in again.');
    }
  }, []);

  const devLogin = useCallback(() => {
    const mockUser = { uid: 'dev-user', email: 'dev@loboep.com', displayName: 'Dev User' } as any;
    dispatch({ type: 'SET_USER', payload: { firebaseUser: mockUser } });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        logoutEverywhere,
        forgotPassword,
        loginWithBiometric,
        devLogin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection';
    default:
      return code.startsWith('Account temporarily') ? code : 'Authentication failed. Please try again';
  }
}
