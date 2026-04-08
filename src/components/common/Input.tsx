import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  containerStyle,
  style,
  ...props
}, ref) => {
  const [secureText, setSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  const toggleSecure = () => setSecureText((v) => !v);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputRow,
          isFocused && styles.inputRowFocused,
          !!error && styles.inputRowError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? Colors.crimson : Colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          ref={ref}
          style={[styles.input, !!leftIcon && styles.inputWithLeft, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity onPress={toggleSecure} style={styles.rightIcon} activeOpacity={0.7}>
            <Ionicons
              name={secureText ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={Colors.steel}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            activeOpacity={0.7}
            disabled={!onRightIconPress}
          >
            <Ionicons name={rightIcon} size={18} color={Colors.steel} />
          </TouchableOpacity>
        ) : null}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && hint && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
});

Input.displayName = 'Input';
export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface3,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  inputRowFocused: {
    borderColor: Colors.crimson,
  },
  inputRowError: {
    borderColor: Colors.error,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.regular,
  },
  inputWithLeft: {},
  errorText: {
    color: Colors.errorLight,
    fontSize: Typography.size.xs,
    marginTop: Spacing.xs,
    marginLeft: 2,
  },
  hintText: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: Spacing.xs,
    marginLeft: 2,
  },
});
