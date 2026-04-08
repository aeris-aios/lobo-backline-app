import * as SecureStore from 'expo-secure-store';

const KEYS = {
  AUTH_TOKEN: 'lobo_auth_token',
  REFRESH_TOKEN: 'lobo_refresh_token',
  USER_ID: 'lobo_user_id',
  BIOMETRIC_ENABLED: 'lobo_biometric_enabled',
  REMEMBER_ME: 'lobo_remember_me',
  SESSION_EXPIRY: 'lobo_session_expiry',
} as const;

export const SecureStorage = {
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async setUserId(userId: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_ID, userId);
  },

  async getUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.USER_ID);
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, String(enabled));
  },

  async getBiometricEnabled(): Promise<boolean> {
    const val = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
    return val === 'true';
  },

  async setRememberMe(remember: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REMEMBER_ME, String(remember));
  },

  async getRememberMe(): Promise<boolean> {
    const val = await SecureStore.getItemAsync(KEYS.REMEMBER_ME);
    return val === 'true';
  },

  async setSessionExpiry(expiry: number): Promise<void> {
    await SecureStore.setItemAsync(KEYS.SESSION_EXPIRY, String(expiry));
  },

  async isSessionValid(): Promise<boolean> {
    const expiry = await SecureStore.getItemAsync(KEYS.SESSION_EXPIRY);
    if (!expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  },

  async clearAll(): Promise<void> {
    await Promise.all(
      Object.values(KEYS).map((key) => SecureStore.deleteItemAsync(key))
    );
  },
};
