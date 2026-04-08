export const Validators = {
  email(value: string): string | null {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return 'Email is required';
    if (!re.test(value)) return 'Enter a valid email address';
    return null;
  },

  password(value: string): string | null {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must include at least one uppercase letter';
    if (!/[0-9]/.test(value)) return 'Must include at least one number';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))
      return 'Must include at least one special character';
    return null;
  },

  phone(value: string): string | null {
    const digits = value.replace(/\D/g, '');
    if (!value.trim()) return 'Phone number is required';
    if (digits.length < 10) return 'Enter a valid phone number';
    return null;
  },

  required(value: string, fieldName = 'This field'): string | null {
    if (!value.trim()) return `${fieldName} is required`;
    return null;
  },

  name(value: string, fieldName = 'Name'): string | null {
    if (!value.trim()) return `${fieldName} is required`;
    if (value.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    return null;
  },
};

export function passwordStrength(password: string): 'weak' | 'fair' | 'strong' | 'very_strong' {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3 || score === 4) return 'strong';
  return 'very_strong';
}
