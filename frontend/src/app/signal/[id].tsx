import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '../../theme/colors';

// Mock data for signal details
const SIGNAL_DETAILS: Record<string, {
  title: string;
  whatHappened: string;
  whyItMatters: string;
  actions: string[];
}> = {
  '1': {
    title: 'Fed Rate Decision',
    whatHappened: 'The Federal Reserve decided to maintain interest rates at 5.25%, holding steady for the third consecutive meeting. Chair Powell signaled that rate cuts may come later this year if inflation continues to cool.',
    whyItMatters: 'Interest rates affect everything from mortgage payments to savings account yields. When rates stay high, borrowing costs remain elevated, but savers benefit from better returns on deposits and bonds.',
    actions: [
      'Review your savings account rates — consider high-yield options',
      'If you have variable-rate debt, prepare for continued high payments',
      'Bond investments may become more attractive',
      'Hold off on major purchases requiring financing',
    ],
  },
  '2': {
    title: 'CPI Data Release',
    whatHappened: 'The Consumer Price Index (CPI) showed inflation at 3.2% year-over-year, slightly below the expected 3.3%. Core inflation, excluding food and energy, came in at 3.8%.',
    whyItMatters: 'Lower-than-expected inflation is good news for consumers and markets. It suggests the Fed\'s policies are working and may lead to earlier rate cuts, which could boost stocks and lower borrowing costs.',
    actions: [
      'Continue maintaining a diversified portfolio',
      'Consider inflation-protected securities (TIPS) allocation',
      'Review your budget — some categories may see price relief',
      'Stay invested — falling inflation is typically good for stocks',
    ],
  },
  '3': {
    title: 'Jobs Report',
    whatHappened: 'The economy added 180,000 jobs in the latest month, with unemployment holding steady at 3.9%. Wage growth remained moderate at 4.1% year-over-year.',
    whyItMatters: 'A stable job market supports consumer spending and economic growth. Moderate wage growth helps control inflation while still supporting household incomes.',
    actions: [
      'If employed, this is a good time to negotiate raises',
      'Job seekers still have leverage in many sectors',
      'Continue building emergency savings (3-6 months expenses)',
      'Consider upskilling for higher-demand roles',
    ],
  },
};

export default function SignalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = SIGNAL_DETAILS[id || '1'];

  if (!detail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Signal not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Signal Details' }} />

      <View style={styles.content}>
        <Text style={styles.title}>{detail.title}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Happened</Text>
          <Text style={styles.sectionText}>{detail.whatHappened}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why It Matters</Text>
          <Text style={styles.sectionText}>{detail.whyItMatters}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Actions</Text>
          {detail.actions.map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <Text style={styles.actionNumber}>{index + 1}</Text>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This is general information, not financial advice. Consult a professional before making investment decisions.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: 12 },
  sectionText: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
  actionItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  actionText: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 22 },
  disclaimer: {
    backgroundColor: colors.cardLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  disclaimerText: { fontSize: 13, color: colors.textMuted, lineHeight: 20, textAlign: 'center' },
  errorText: { color: colors.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 40 },
});
