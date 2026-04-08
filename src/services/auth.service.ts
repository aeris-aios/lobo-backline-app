import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';
import { SecureStorage } from '../utils/storage';

// Session duration: 30 days
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// Track failed login attempts for lockout
const loginAttempts: Map<string, { count: number; lockedUntil: number }> = new Map();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function checkLockout(identifier: string): { locked: boolean; remainingMs: number } {
  const record = loginAttempts.get(identifier);
  if (!record) return { locked: false, remainingMs: 0 };

  if (record.lockedUntil > Date.now()) {
    return { locked: true, remainingMs: record.lockedUntil - Date.now() };
  }
  return { locked: false, remainingMs: 0 };
}

function recordFailedAttempt(identifier: string): void {
  const record = loginAttempts.get(identifier) ?? { count: 0, lockedUntil: 0 };
  record.count++;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS;
    record.count = 0;
  }
  loginAttempts.set(identifier, record);
}

function clearAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

export const AuthService = {
  async login(
    email: string,
    password: string,
    rememberMe = false
  ): Promise<FirebaseUser> {
    const lockout = checkLockout(email.toLowerCase());
    if (lockout.locked) {
      const minutes = Math.ceil(lockout.remainingMs / 60000);
      throw new Error(`Account temporarily locked. Try again in ${minutes} minute(s).`);
    }

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      clearAttempts(email.toLowerCase());

      const token = await credential.user.getIdToken();
      await SecureStorage.setToken(token);
      await SecureStorage.setUserId(credential.user.uid);
      await SecureStorage.setRememberMe(rememberMe);
      await SecureStorage.setSessionExpiry(Date.now() + SESSION_DURATION_MS);

      return credential.user;
    } catch (error) {
      recordFailedAttempt(email.toLowerCase());
      throw error;
    }
  },

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, {
      displayName: `${firstName} ${lastName}`,
    });

    const token = await credential.user.getIdToken();
    await SecureStorage.setToken(token);
    await SecureStorage.setUserId(credential.user.uid);
    await SecureStorage.setSessionExpiry(Date.now() + SESSION_DURATION_MS);

    return credential.user;
  },

  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  },

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    await SecureStorage.clearAll();
  },

  async logoutEverywhere(): Promise<void> {
    // In production: call backend to invalidate all tokens
    await signOut(firebaseAuth);
    await SecureStorage.clearAll();
  },

  async refreshToken(): Promise<string | null> {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    const token = await user.getIdToken(true);
    await SecureStorage.setToken(token);
    return token;
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(firebaseAuth, callback);
  },

  getCurrentUser(): FirebaseUser | null {
    return firebaseAuth.currentUser;
  },
};
