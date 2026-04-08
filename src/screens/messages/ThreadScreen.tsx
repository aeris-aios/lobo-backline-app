import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import { MessagesStackParamList } from '../../types';
import Header from '../../components/common/Header';

type RouteType = RouteProp<MessagesStackParamList, 'Thread'>;

const MOCK_MESSAGES = [
  {
    id: 'm1',
    senderId: 'dispatch',
    senderName: 'Dispatch',
    senderRole: 'dispatch' as const,
    body: 'Hello, your booking BK_001 has been confirmed for April 10 at 8:00 AM.',
    createdAt: '2026-04-07T14:00:00Z',
  },
  {
    id: 'm2',
    senderId: 'dispatch',
    senderName: 'Dispatch',
    senderRole: 'dispatch' as const,
    body: 'Agent Marcus W. has been assigned to your detail. He carries armed credentials and will be in executive attire.',
    createdAt: '2026-04-07T14:01:00Z',
  },
  {
    id: 'm3',
    senderId: 'me',
    senderName: 'You',
    senderRole: 'client' as const,
    body: 'Thank you. Will he be able to assist with luggage at the hotel?',
    createdAt: '2026-04-07T14:05:00Z',
  },
  {
    id: 'm4',
    senderId: 'dispatch',
    senderName: 'Dispatch',
    senderRole: 'dispatch' as const,
    body: 'Absolutely. Please also note that ETA updates will be sent 30 minutes and 10 minutes before your scheduled pickup.',
    createdAt: '2026-04-07T14:06:00Z',
  },
];

export default function ThreadScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteType>();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [draft, setDraft] = useState('');
  const flatRef = useRef<FlatList>(null);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        senderId: 'me',
        senderName: 'You',
        senderRole: 'client' as const,
        body: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
    const isMe = item.senderId === 'me';
    const time = new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        {!isMe && (
          <View style={styles.msgAvatar}>
            <Ionicons name="radio-outline" size={14} color={Colors.steel} />
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
          <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.body}</Text>
          <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header
          title="Dispatch — BK_001"
          subtitle="LOBO EP Operations"
          showBack
        />

        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Ionicons name="attach-outline" size={22} color={Colors.steel} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Message dispatch..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, draft.trim() ? styles.sendBtnActive : {}]}
            onPress={sendMessage}
            activeOpacity={0.8}
            disabled={!draft.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={draft.trim() ? Colors.white : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  messageList: { padding: Spacing.base, gap: Spacing.md },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  msgRowMe: { flexDirection: 'row-reverse' },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  bubbleThem: {
    backgroundColor: Colors.surface2,
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: Colors.crimson,
    borderBottomRightRadius: 4,
  },
  senderName: {
    color: Colors.steel,
    fontSize: 10,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  msgText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    lineHeight: 22,
  },
  msgTextMe: { color: Colors.white },
  msgTime: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeMe: { color: 'rgba(255,255,255,0.6)' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    maxHeight: 120,
    minHeight: 40,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: Colors.crimson },
});
