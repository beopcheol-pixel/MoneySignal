import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  'How should I start investing?',
  'What does the Fed rate mean for me?',
  'How much should I save monthly?',
  'Is now a good time to buy stocks?',
];

const MOCK_RESPONSES: Record<string, string> = {
  'How should I start investing?': "Great question! Here's a simple path to start:\n\n1. Build an emergency fund (3-6 months expenses)\n2. Pay off high-interest debt first\n3. Start with low-cost index funds (like S&P 500)\n4. Consider tax-advantaged accounts (401k, IRA)\n5. Invest regularly, don't try to time the market\n\nStart small, stay consistent, and increase over time.",
  'What does the Fed rate mean for me?': "The Federal Reserve rate affects your daily finances:\n\n• Savings accounts: Higher rates = better returns\n• Mortgages: Higher rates = more expensive loans\n• Credit cards: Rates usually go up with Fed rates\n• Stocks: Can cause short-term volatility\n\nRight now rates are high, so it's a good time for savings but expensive for borrowing.",
  'How much should I save monthly?': "A common guideline is the 50/30/20 rule:\n\n• 50% for needs (rent, food, utilities)\n• 30% for wants (entertainment, dining)\n• 20% for savings and debt repayment\n\nIf 20% feels too much, start with 10% and increase by 1% each month. The key is consistency over amount.",
  'Is now a good time to buy stocks?': "Time in the market beats timing the market. Here's what to consider:\n\n• If you have a 10+ year horizon, any time is good\n• Use dollar-cost averaging to reduce risk\n• Don't invest money you'll need within 5 years\n• Current valuations are slightly elevated\n\nFocus on your goals, not short-term market movements.",
};

const DEFAULT_RESPONSE = "That's a thoughtful question! Here are some things to consider:\n\n• Start with your financial goals\n• Consider your risk tolerance\n• Diversification is key\n• Stay informed but don't overreact\n\nWould you like me to elaborate on any of these points?";

export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "Hi! I'm your AI financial coach. 👋\n\nI can help you with investing basics, understanding economic signals, budgeting, and more.\n\nTry one of the quick questions below, or ask me anything!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowQuickQuestions(false);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = MOCK_RESPONSES[messageText] || DEFAULT_RESPONSE;
    const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.role === 'user' && styles.userMessageRow]}>
      {item.role === 'assistant' && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View style={[styles.message, item.role === 'user' ? styles.userMessage : styles.aiMessage]}>
        <Text style={[styles.messageText, item.role === 'user' && styles.userMessageText]}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Coach</Text>
        <Text style={styles.headerSubtitle}>Your personal financial advisor</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={
          loading ? (
            <View style={styles.typingIndicator}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>Thinking...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {showQuickQuestions && (
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickQuestions}>
            {QUICK_QUESTIONS.map((q, i) => (
              <TouchableOpacity key={i} style={styles.quickQuestionButton} onPress={() => sendMessage(q)}>
                <Text style={styles.quickQuestionText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  messageList: { padding: 16, gap: 16 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  userMessageRow: { justifyContent: 'flex-end' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18 },
  message: { maxWidth: '75%', padding: 14, borderRadius: 18 },
  userMessage: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  aiMessage: { backgroundColor: colors.card, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  userMessageText: { color: '#fff' },
  typingIndicator: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 8 },
  typingBubble: { backgroundColor: colors.card, padding: 14, borderRadius: 18, borderBottomLeftRadius: 4 },
  typingText: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic' },
  quickQuestionsContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  quickQuestionsTitle: { fontSize: 13, color: colors.textMuted, marginBottom: 10, fontWeight: '500' },
  quickQuestions: { gap: 10 },
  quickQuestionButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickQuestionText: { fontSize: 14, color: colors.text },
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
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    maxHeight: 100,
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
