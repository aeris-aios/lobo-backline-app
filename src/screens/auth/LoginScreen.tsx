import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Validators } from '../../utils/validators';
import { AuthStackParamList } from '../../types';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { login, loginWithBiometric, biometricAvailable, isLoading, error, clearError, devLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const passwordRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const emailError = Validators.email(email);
    const passwordError = Validators.required(password, 'Password');
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;
    try {
      await login(email.trim().toLowerCase(), password, rememberMe);
    } catch {
      // error shown via context state
    }
  };

  const handleBiometric = async () => {
    try {
      await loginWithBiometric();
    } catch (e: any) {
      Alert.alert('Biometric Failed', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0A0A0A', '#0F0F0F', '#0A0A0A']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={styles.logoMark}
              resizeMode="contain"
            />
            <View style={styles.divider} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.heading}>Secure Access</Text>
            <Text style={styles.subheading}>Sign in to your account</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={16} color={Colors.errorLight} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <Input
              label="Email"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
              error={errors.email}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              placeholder="your@email.com"
            />

            <Input
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              error={errors.password}
              leftIcon="lock-closed-outline"
              isPassword
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              placeholder="••••••••"
            />

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setRememberMe((v) => !v)}
                style={styles.checkRow}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                </View>
                <Text style={styles.checkLabel}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              size="lg"
              style={styles.submitBtn}
            />

            {__DEV__ && (
              <TouchableOpacity onPress={devLogin} style={styles.devBtn} activeOpacity={0.7}>
                <Text style={styles.devBtnText}>⚡ DEV — Skip Login</Text>
              </TouchableOpacity>
            )}

            {biometricAvailable && (
              <TouchableOpacity
                onPress={handleBiometric}
                style={styles.biometricBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="finger-print-outline" size={22} color={Colors.steel} />
                <Text style={styles.biometricText}>Use biometric login</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <Text style={styles.footerText}>New to LOBO EP?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
              <Text style={styles.footerLink}> Request Access</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing['2xl'] },
  logoSection: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  logoMark: {
    width: 180,
    height: 160,
    marginBottom: Spacing.sm,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.crimson,
    marginTop: Spacing.sm,
    borderRadius: 1,
  },
  form: { flex: 1 },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.xs,
  },
  subheading: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    marginBottom: Spacing['2xl'],
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C0A0A',
    borderWidth: 1,
    borderColor: Colors.crimsonDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  errorBannerText: {
    color: Colors.errorLight,
    fontSize: Typography.size.sm,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.crimson,
    borderColor: Colors.crimson,
  },
  checkLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
  },
  forgotText: {
    color: Colors.crimsonLight,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  submitBtn: { width: '100%' },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  biometricText: {
    color: Colors.steel,
    fontSize: Typography.size.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['2xl'],
  },
  footerText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  footerLink: {
    color: Colors.crimsonLight,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  devBtn: {
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  devBtnText: {
    color: '#666',
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
