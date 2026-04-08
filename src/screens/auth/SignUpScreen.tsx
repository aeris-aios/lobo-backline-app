import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { Validators, passwordStrength } from '../../utils/validators';
import { AuthStackParamList } from '../../types';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const STRENGTH_LABELS = {
  weak: { label: 'Weak', color: Colors.error },
  fair: { label: 'Fair', color: Colors.warning },
  strong: { label: 'Strong', color: '#2E7D32' },
  very_strong: { label: 'Excellent', color: Colors.successLight },
};

export default function SignUpScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { register, isLoading, error, clearError } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const strength = form.password ? passwordStrength(form.password) : null;
  const strengthInfo = strength ? STRENGTH_LABELS[strength] : null;

  const set = (field: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    clearError();
  };

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    const firstErr = Validators.name(form.firstName, 'First name');
    const lastErr = Validators.name(form.lastName, 'Last name');
    const emailErr = Validators.email(form.email);
    const phoneErr = Validators.phone(form.phone);
    const passErr = Validators.password(form.password);
    if (firstErr) newErrors.firstName = firstErr;
    if (lastErr) newErrors.lastName = lastErr;
    if (emailErr) newErrors.email = emailErr;
    if (phoneErr) newErrors.phone = phoneErr;
    if (passErr) newErrors.password = passErr;
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;
    try {
      await register(form.email.trim().toLowerCase(), form.password, form.firstName.trim(), form.lastName.trim());
    } catch {
      // handled by context
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#0A0A0A', '#0F0F0F', '#0A0A0A']} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subheading}>Join LOBO Executive Protection</Text>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <View style={styles.nameRow}>
            <Input
              label="First Name"
              value={form.firstName}
              onChangeText={set('firstName')}
              error={errors.firstName}
              containerStyle={styles.halfInput}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              placeholder="John"
            />
            <Input
              ref={lastNameRef}
              label="Last Name"
              value={form.lastName}
              onChangeText={set('lastName')}
              error={errors.lastName}
              containerStyle={styles.halfInput}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              placeholder="Smith"
            />
          </View>

          <Input
            ref={emailRef}
            label="Email"
            value={form.email}
            onChangeText={set('email')}
            error={errors.email}
            leftIcon="mail-outline"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            placeholder="your@email.com"
          />

          <Input
            ref={phoneRef}
            label="Phone"
            value={form.phone}
            onChangeText={set('phone')}
            error={errors.phone}
            leftIcon="call-outline"
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            ref={passwordRef}
            label="Password"
            value={form.password}
            onChangeText={set('password')}
            error={errors.password}
            leftIcon="lock-closed-outline"
            isPassword
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            placeholder="Min 8 chars, uppercase, number, symbol"
          />

          {/* Password strength */}
          {strengthInfo && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthBars}>
                {(['weak', 'fair', 'strong', 'very_strong'] as const).map((level, i) => {
                  const levels = ['weak', 'fair', 'strong', 'very_strong'];
                  const currentIdx = levels.indexOf(strength!);
                  const filled = i <= currentIdx;
                  return (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        filled ? { backgroundColor: strengthInfo.color } : {},
                      ]}
                    />
                  );
                })}
              </View>
              <Text style={[styles.strengthLabel, { color: strengthInfo.color }]}>
                {strengthInfo.label}
              </Text>
            </View>
          )}

          <Input
            ref={confirmRef}
            label="Confirm Password"
            value={form.confirmPassword}
            onChangeText={set('confirmPassword')}
            error={errors.confirmPassword}
            leftIcon="shield-checkmark-outline"
            isPassword
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            placeholder="Repeat password"
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            size="lg"
            style={styles.submitBtn}
          />

          <Text style={styles.disclaimer}>
            By creating an account you agree to LOBO EP's Terms of Service and Privacy Policy.
          </Text>

          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.footerLink}> Sign In</Text>
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
  backBtn: { marginBottom: Spacing['2xl'] },
  backText: { color: Colors.steel, fontSize: Typography.size.base },
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
    backgroundColor: '#1C0A0A',
    borderWidth: 1,
    borderColor: Colors.crimsonDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  errorBannerText: { color: Colors.errorLight, fontSize: Typography.size.sm },
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: { flex: 1 },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.base,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  strengthLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
  },
  submitBtn: { width: '100%', marginTop: Spacing.sm },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  footerText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  footerLink: {
    color: Colors.crimsonLight,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
});
