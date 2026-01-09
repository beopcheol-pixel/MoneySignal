import { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '../../theme/colors';

interface Message {
  id: string;
  user_name: string;
  content: string;
  is_checkin: boolean;
}

export default function GroupDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user_name: 'John', content: 'Anyone watching the Fed meeting today?', is_checkin: false },
    { id: '2', user_name: 'Sarah', content: 'Weekly check-in: Stayed within budget this week! 💪', is_checkin: true },
    { id: '3', user_name: 'Mike', content: 'Great job Sarah!', is_checkin: false },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      user_name: 'You',
      content: input,
      is_checkin: false,
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const sendCheckin = () => {
    const checkin: Message = {
      id: Date.now().toString(),
      user_name: 'You',
      content: 'Weekly check-in completed! ✅',
      is_checkin: true,
    };
    setMessages(prev => [...prev, checkin]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.is_checkin && styles.checkinMessage]}>
      <Text style={styles.userName}>{item.user_name}</Text>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Group Chat' }} />

      <TouchableOpacity style={styles.checkinButton} onPress={sendCheckin}>
        <Text style={styles.checkinButtonText}>📋 Weekly Check-in</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  checkinButton: {
    backgroundColor: colors.success,
    margin: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkinButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  messageList: { padding: 16, gap: 12 },
  message: { backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  checkinMessage: { backgroundColor: colors.cardLight, borderLeftWidth: 3, borderLeftColor: colors.success },
  userName: { fontSize: 13, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  messageText: { fontSize: 15, color: colors.text },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
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
  sendButtonText: { color: '#fff', fontSize: 20, fontWeight: '600' },
});
