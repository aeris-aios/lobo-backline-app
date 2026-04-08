import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';

const MOCK_THREADS = [
  {
    id: 'th_001',
    subject: 'Booking BK_001 — Armed EP Detail',
    lastMessage: 'Your agent Marcus W. has been assigned to your booking.',
    senderRole: 'dispatch' as const,
    unreadCount: 2,
    time: '2:34 PM',
    bookingId: 'bk_001',
  },
  {
    id: 'th_002',
    subject: 'Support — Blackline Trip BK_002',
    lastMessage: 'Thank you for your inquiry. A specialist will follow up within 1 hour.',
    senderRole: 'support' as const,
    unreadCount: 0,
    time: 'Apr 2',
    bookingId: 'bk_002',
  },
  {
    id: 'th_003',
    subject: 'General Support',
    lastMessage: 'Welcome to LOBO EP. How can we assist you today?',
    senderRole: 'support' as const,
    unreadCount: 0,
    time: 'Mar 28',
    bookingId: undefined,
  },
];

const ROLE_ICON = {
  dispatch: 'radio-outline',
  support: 'headset-outline',
  agent: 'person-outline',
  client: 'person-circle-outline',
} as const;

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const totalUnread = MOCK_THREADS.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <Text style={styles.headerSub}>{totalUnread} unread message{totalUnread > 1 ? 's' : ''}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.newBtn} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_THREADS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.thread, item.unreadCount > 0 && styles.threadUnread]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Thread', { threadId: item.id })}
          >
            <View style={[styles.avatar, item.unreadCount > 0 && styles.avatarUnread]}>
              <Ionicons
                name={ROLE_ICON[item.senderRole]}
                size={20}
                color={item.unreadCount > 0 ? Colors.crimson : Colors.steel}
              />
            </View>

            <View style={styles.threadContent}>
              <View style={styles.threadTop}>
                <Text style={[styles.threadSubject, item.unreadCount > 0 && styles.threadSubjectUnread]} numberOfLines={1}>
                  {item.subject}
                </Text>
                <Text style={styles.threadTime}>{item.time}</Text>
              </View>
              <View style={styles.threadBottom}>
                <Text style={styles.threadPreview} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  headerSub: { color: Colors.crimsonLight, fontSize: Typography.size.xs, marginTop: 2 },
  newBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {},
  thread: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  threadUnread: { backgroundColor: 'rgba(139,0,0,0.04)' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarUnread: { borderColor: Colors.crimsonDark, backgroundColor: 'rgba(139,0,0,0.1)' },
  threadContent: { flex: 1 },
  threadTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  threadSubject: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    flex: 1,
    marginRight: Spacing.sm,
  },
  threadSubjectUnread: { color: Colors.textPrimary, fontWeight: Typography.weight.semiBold },
  threadTime: { color: Colors.textMuted, fontSize: Typography.size.xs },
  threadBottom: { flexDirection: 'row', alignItems: 'center' },
  threadPreview: { color: Colors.textMuted, fontSize: Typography.size.sm, flex: 1 },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  unreadCount: { color: Colors.white, fontSize: 10, fontWeight: Typography.weight.bold },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 72 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: Spacing.md },
  emptyText: { color: Colors.textMuted, fontSize: Typography.size.base },
});
