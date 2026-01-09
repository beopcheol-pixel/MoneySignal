import { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '../../theme/colors';

interface Message {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  time: string;
  isCheckin: boolean;
  checkinData?: {
    savedThisWeek: string;
    goalProgress: number;
  };
}

const GROUP_DATA: Record<string, { name: string; icon: string; messages: Message[] }> = {
  '1': {
    name: 'Beginner Investors',
    icon: '🌱',
    messages: [
      { id: '1', userName: 'Alex', userAvatar: '👨', content: 'Just opened my first brokerage account! Any tips for a complete beginner?', time: '10:30 AM', isCheckin: false },
      { id: '2', userName: 'Sarah', userAvatar: '👩', content: 'Start with index funds! Low cost and diversified. I recommend VTI or VOO.', time: '10:32 AM', isCheckin: false },
      { id: '3', userName: 'Mike', userAvatar: '🧔', content: '', time: '10:45 AM', isCheckin: true, checkinData: { savedThisWeek: '$150', goalProgress: 68 } },
      { id: '4', userName: 'Emma', userAvatar: '👱‍♀️', content: 'Does anyone use automatic investing? Thinking of setting up weekly buys.', time: '11:00 AM', isCheckin: false },
      { id: '5', userName: 'James', userAvatar: '👨‍🦱', content: 'Yes! I do $50/week into VTI. Set it and forget it. Been doing it for 2 years now.', time: '11:05 AM', isCheckin: false },
    ],
  },
  '2': {
    name: 'Dividend Hunters',
    icon: '💵',
    messages: [
      { id: '1', userName: 'Robert', userAvatar: '👴', content: 'JNJ just announced a dividend increase! 61 years of consecutive raises.', time: '9:15 AM', isCheckin: false },
      { id: '2', userName: 'Linda', userAvatar: '👩‍🦳', content: "Nice! That's why I love dividend aristocrats. Reliable income.", time: '9:20 AM', isCheckin: false },
      { id: '3', userName: 'David', userAvatar: '🧑', content: '', time: '9:30 AM', isCheckin: true, checkinData: { savedThisWeek: '$300', goalProgress: 85 } },
      { id: '4', userName: 'Susan', userAvatar: '👩‍🦰', content: 'What yield are you all targeting? I aim for 3-4% with growth potential.', time: '10:00 AM', isCheckin: false },
    ],
  },
  '3': {
    name: 'Tech Stock Club',
    icon: '💻',
    messages: [
      { id: '1', userName: 'Kevin', userAvatar: '🧑‍💻', content: 'NVDA earnings next week. Anyone adding before?', time: '2:00 PM', isCheckin: false },
      { id: '2', userName: 'Lisa', userAvatar: '👩‍💻', content: 'Already overweight on NVDA. Waiting for a pullback.', time: '2:05 PM', isCheckin: false },
      { id: '3', userName: 'Tom', userAvatar: '👨‍💼', content: 'The AI boom is real but valuations are stretched. Being cautious.', time: '2:10 PM', isCheckin: false },
    ],
  },
};

const DEFAULT_GROUP = {
  name: 'Group Chat',
  icon: '👥',
  messages: [
    { id: '1', userName: 'Member', userAvatar: '👤', content: 'Welcome to the group!', time: 'Just now', isCheckin: false },
  ],
};

export default function GroupDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = GROUP_DATA[id || '1'] || DEFAULT_GROUP;
  const [messages, setMessages] = useState<Message[]>(group.messages);
  const [input, setInput] = useState('');
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      userName: 'You',
      userAvatar: '😊',
      content: input,
      time: 'Just now',
      isCheckin: false,
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const sendCheckin = (saved: string) => {
    const checkin: Message = {
      id: Date.now().toString(),
      userName: 'You',
      userAvatar: '😊',
      content: '',
      time: 'Just now',
      isCheckin: true,
      checkinData: { savedThisWeek: saved, goalProgress: Math.floor(Math.random() * 30) + 60 },
    };
    setMessages(prev => [...prev, checkin]);
    setShowCheckinModal(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.isCheckin && styles.checkinMessage]}>
      <View style={styles.messageHeader}>
        <Text style={styles.avatar}>{item.userAvatar}</Text>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {item.isCheckin ? (
        <View style={styles.checkinContent}>
          <Text style={styles.checkinTitle}>📋 Weekly Check-in</Text>
          <View style={styles.checkinStats}>
            <View style={styles.checkinStat}>
              <Text style={styles.checkinLabel}>Saved this week</Text>
              <Text style={styles.checkinValue}>{item.checkinData?.savedThisWeek}</Text>
            </View>
            <View style={styles.checkinStat}>
              <Text style={styles.checkinLabel}>Goal progress</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.checkinData?.goalProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{item.checkinData?.goalProgress}%</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.messageText}>{item.content}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: group.name }} />

      <View style={styles.groupHeader}>
        <Text style={styles.groupIcon}>{group.icon}</Text>
        <View>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupMembers}>{messages.length} messages today</Text>
        </View>
      </View>

      {showCheckinModal && (
        <View style={styles.checkinModal}>
          <Text style={styles.checkinModalTitle}>Weekly Check-in</Text>
          <Text style={styles.checkinModalSubtitle}>How much did you save this week?</Text>
          <View style={styles.checkinOptions}>
            {['$50', '$100', '$150', '$200+'].map((amount) => (
              <TouchableOpacity key={amount} style={styles.checkinOption} onPress={() => sendCheckin(amount)}>
                <Text style={styles.checkinOptionText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.checkinCancel} onPress={() => setShowCheckinModal(false)}>
            <Text style={styles.checkinCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.checkinButton} onPress={() => setShowCheckinModal(true)}>
          <Text style={styles.checkinButtonText}>📋</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupIcon: { fontSize: 32, marginRight: 12 },
  groupName: { fontSize: 18, fontWeight: '600', color: colors.text },
  groupMembers: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  messageList: { padding: 16, gap: 12 },
  message: { backgroundColor: colors.card, borderRadius: 16, padding: 14 },
  checkinMessage: { borderLeftWidth: 3, borderLeftColor: colors.success },
  messageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { fontSize: 20, marginRight: 8 },
  userName: { fontSize: 14, fontWeight: '600', color: colors.primary, flex: 1 },
  time: { fontSize: 12, color: colors.textMuted },
  messageText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  checkinContent: {},
  checkinTitle: { fontSize: 14, fontWeight: '600', color: colors.success, marginBottom: 12 },
  checkinStats: { gap: 12 },
  checkinStat: {},
  checkinLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  checkinValue: { fontSize: 20, fontWeight: '700', color: colors.text },
  progressBar: { height: 8, backgroundColor: colors.cardLight, borderRadius: 4, marginTop: 4 },
  progressFill: { height: '100%', backgroundColor: colors.success, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: colors.success, marginTop: 4 },
  checkinModal: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkinModalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  checkinModalSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  checkinOptions: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  checkinOption: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  checkinOptionText: { color: '#fff', fontWeight: '600' },
  checkinCancel: { marginTop: 16, alignItems: 'center' },
  checkinCancelText: { color: colors.textMuted, fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkinButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkinButtonText: { fontSize: 20 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: { color: '#fff', fontSize: 20, fontWeight: '600' },
});
