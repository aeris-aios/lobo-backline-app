import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

interface Field {
  key: string;
  label: string;
  value: string;
  readOnly?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}

const INITIAL_FIELDS: Field[] = [
  { key: 'name', label: 'Full Name', value: 'Alex Morgan', keyboardType: 'default' },
  { key: 'phone', label: 'Phone Number', value: '+1 (214) 555-0182', keyboardType: 'phone-pad' },
  { key: 'email', label: 'Email', value: 'alex@loboep.com', readOnly: true, keyboardType: 'email-address' },
  { key: 'dob', label: 'Date of Birth', value: 'March 12, 1985', keyboardType: 'default' },
  { key: 'emergencyName', label: 'Emergency Contact Name', value: 'James Morgan', keyboardType: 'default' },
  { key: 'emergencyPhone', label: 'Emergency Contact Phone', value: '+1 (214) 555-0199', keyboardType: 'phone-pad' },
];

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();
  const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (field: Field) => {
    if (field.readOnly) return;
    setEditingKey(field.key);
    setEditValue(field.value);
  };

  const commitEdit = () => {
    if (!editingKey) return;
    setFields(prev =>
      prev.map(f => (f.key === editingKey ? { ...f, value: editValue } : f))
    );
    setEditingKey(null);
  };

  const handleSave = () => {
    if (editingKey) commitEdit();
    Alert.alert('Saved', 'Your personal information has been updated.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Personal Information" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Profile</Text>
        <View style={styles.sectionCard}>
          {fields.slice(0, 3).map((field, index) => (
            <React.Fragment key={field.key}>
              {index > 0 && <View style={styles.divider} />}
              <FieldRow
                field={field}
                isEditing={editingKey === field.key}
                editValue={editValue}
                onEditChange={setEditValue}
                onStartEdit={() => startEdit(field)}
                onCommit={commitEdit}
              />
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Emergency Contact</Text>
        <View style={styles.sectionCard}>
          {fields.slice(3).map((field, index) => (
            <React.Fragment key={field.key}>
              {index > 0 && <View style={styles.divider} />}
              <FieldRow
                field={field}
                isEditing={editingKey === field.key}
                editValue={editValue}
                onEditChange={setEditValue}
                onStartEdit={() => startEdit(field)}
                onCommit={commitEdit}
              />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.steel} />
          <Text style={styles.infoText}>
            Your personal data is encrypted and only used to facilitate your protection services.
            Emergency contact information is shared with your detail team for critical situations only.
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FieldRow({
  field,
  isEditing,
  editValue,
  onEditChange,
  onStartEdit,
  onCommit,
}: {
  field: Field;
  isEditing: boolean;
  editValue: string;
  onEditChange: (v: string) => void;
  onStartEdit: () => void;
  onCommit: () => void;
}) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.fieldInput}
            value={editValue}
            onChangeText={onEditChange}
            onBlur={onCommit}
            onSubmitEditing={onCommit}
            autoFocus
            keyboardType={field.keyboardType ?? 'default'}
            placeholderTextColor={Colors.textMuted}
            selectionColor={Colors.crimsonLight}
          />
        ) : (
          <Text style={[styles.fieldValue, field.readOnly && styles.fieldValueMuted]}>
            {field.value}
          </Text>
        )}
      </View>
      {!field.readOnly ? (
        <TouchableOpacity
          onPress={isEditing ? onCommit : onStartEdit}
          style={styles.editIconBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isEditing ? 'checkmark' : 'pencil-outline'}
            size={16}
            color={isEditing ? Colors.successLight : Colors.steel}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.editIconBtn}>
          <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.base },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  fieldContent: { flex: 1 },
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    marginBottom: 4,
    letterSpacing: Typography.letterSpacing.wide,
  },
  fieldValue: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.regular,
  },
  fieldValueMuted: {
    color: Colors.textSecondary,
  },
  fieldInput: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    padding: 0,
    margin: 0,
  },
  editIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
  },

  infoCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginTop: Spacing.xl,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    lineHeight: 20,
    flex: 1,
  },

  saveButton: {
    backgroundColor: Colors.crimson,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
