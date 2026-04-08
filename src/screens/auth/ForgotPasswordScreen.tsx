import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Validators } from '../../utils/validators';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const err = Validators.email(email);
    if (err) { setEmailError(err); return; }

    setIsLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setIsSent(true);
    } catch {
      setEmailError('Could not send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#0A0A0A', '#0F0F0F']} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {isSent ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color={Colors.successLight} />
              </View>
              <Text style={styles.heading}>Email Sent</Text>
              <Text style={styles.successBody}>
                If an account exists for {email}, you will receive a password reset link shortly.
                Check your inbox and spam folder.
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() => navigation.goBack()}
                style={styles.btn}
                size="lg"
              />
            </View>
          ) : (
            <View>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-open-outline" size={48} color={Colors.crimson} />
              </View>
              <Text style={styles.heading}>Reset Password</Text>
              <Text style={styles.subheading}>
                Enter your email address and we'll send you a secure link to reset your password.
              </Text>

              <Input
                label="Email Address"
                value={email}
                onChangeText={(v) => { setEmail(v); setEmailError(null); }}
                error={emailError}
                leftIcon="mail-outline"
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                placeholder="your@email.com"
              />

              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                isLoading={isLoading}
                size="lg"
                style={styles.btn}
              />
            </View>
          )}
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
  iconContainer: { marginBottom: Spacing['2xl'] },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.sm,
  },
  subheading: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    lineHeight: 24,
    marginBottom: Spacing['2xl'],
  },
  btn: { width: '100%', marginTop: Spacing.sm },
  successContainer: { flex: 1, alignItems: 'center', paddingTop: Spacing['4xl'] },
  successIcon: { marginBottom: Spacing['2xl'] },
  successBody: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing['3xl'],
    paddingHorizontal: Spacing.base,
  },
});
