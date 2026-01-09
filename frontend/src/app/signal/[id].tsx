import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

interface SignalDetail {
  title: string;
  type: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  date: string;
  whatHappened: string[];
  whyItMatters: string[];
  whatToDo: string[];
  nextCheck: string;
}

const SIGNAL_DETAILS: Record<string, SignalDetail> = {
  '1': {
    title: 'Fed Rate Decision',
    type: 'Monetary Policy',
    riskLevel: 'Medium',
    date: 'Today, 2:00 PM',
    whatHappened: [
      'Federal Reserve held interest rates steady at 5.25-5.50%',
      'Third consecutive meeting without changes',
      'Chair Powell hinted at possible cuts later this year',
      'Inflation progress noted but deemed "not yet sufficient"',
    ],
    whyItMatters: [
      'Your savings accounts and CDs continue earning higher interest',
      'Variable-rate loans and credit card payments stay elevated',
      'Mortgage rates likely to remain stable in the short term',
      'Stock market typically responds well to rate stability',
    ],
    whatToDo: [
      'Keep your savings in a high-yield account (4-5% APY)',
      'Prioritize paying down high-interest credit card debt',
      'Avoid making sudden changes to your investment strategy',
      'Consider locking in CD rates while they remain high',
    ],
    nextCheck: 'Check again in 6 weeks (next Fed meeting)',
  },
  '2': {
    title: 'CPI Data Release',
    type: 'Inflation',
    riskLevel: 'Low',
    date: 'Today, 8:30 AM',
    whatHappened: [
      'Consumer Price Index came in at 3.2% year-over-year',
      'Below expectations of 3.3%',
      'Core inflation at 3.8% (excludes food & energy)',
      'Housing costs still elevated but showing signs of slowing',
    ],
    whyItMatters: [
      'Lower inflation means your money goes further',
      'Increases likelihood of Fed rate cuts this year',
      'Good news for both stock and bond investors',
      'Grocery and gas prices may see continued relief',
    ],
    whatToDo: [
      'Review your budget - some categories may see savings',
      'Stay invested - falling inflation is historically good for stocks',
      'Continue regular investment contributions',
      'No need to make major financial changes',
    ],
    nextCheck: 'Check again in 30 days (next CPI release)',
  },
  '3': {
    title: 'Jobs Report',
    type: 'Employment',
    riskLevel: 'Low',
    date: 'Today, 8:30 AM',
    whatHappened: [
      'Economy added 180,000 new jobs (vs 200K expected)',
      'Unemployment rate steady at 3.9%',
      'Wage growth at 4.1% year-over-year',
      'Healthcare and technology sectors led job gains',
    ],
    whyItMatters: [
      'Strong job market means better job security for you',
      'Good time to negotiate raises or explore new opportunities',
      'Moderate growth is ideal - strong but not inflationary',
      'Consumer spending likely to remain healthy',
    ],
    whatToDo: [
      'Consider asking for a raise if overdue',
      'Build emergency savings (aim for 3-6 months expenses)',
      'Invest in skills that are in demand',
      'No defensive moves needed - economy remains stable',
    ],
    nextCheck: 'Check again in 30 days (next jobs report)',
  },
};

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const detail = SIGNAL_DETAILS[id || '1'];

  if (!detail) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Signal' }} />
        <Text style={styles.errorText}>Signal not found</Text>
      </View>
    );
  }

  const riskColor = {
    Low: colors.success,
    Medium: colors.signalMedium,
    High: colors.signalHigh,
  }[detail.riskLevel];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: '', headerTransparent: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{detail.type}</Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
            <Text style={styles.riskText}>{detail.riskLevel} Risk</Text>
          </View>
        </View>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.date}>{detail.date}</Text>
      </View>

      {/* Section: What Happened */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📰</Text>
          <Text style={styles.sectionTitle}>What Happened</Text>
        </View>
        <View style={styles.sectionContent}>
          {detail.whatHappened.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section: Why It Matters */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💡</Text>
          <Text style={styles.sectionTitle}>Why It Matters</Text>
        </View>
        <View style={styles.sectionContent}>
          {detail.whyItMatters.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section: What I Should Do */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✅</Text>
          <Text style={styles.sectionTitle}>What I Should Do</Text>
        </View>
        <View style={styles.sectionContent}>
          {detail.whatToDo.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bullet, styles.bulletGreen]}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Next Check */}
      <View style={styles.nextCheckContainer}>
        <Text style={styles.nextCheckIcon}>🗓️</Text>
        <Text style={styles.nextCheckText}>{detail.nextCheck}</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Signals</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    padding: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // Sections
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionContent: {
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 4,
  },
  bullet: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 12,
    lineHeight: 24,
  },
  bulletGreen: {
    color: colors.success,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Next Check
  nextCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 12,
  },
  nextCheckIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  nextCheckText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Back Button
  backButton: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  bottomSpacer: {
    height: 40,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
