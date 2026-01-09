import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

interface Signal {
  id: number;
  title: string;
  content: string;
  signal_type: string;
  impact: string;
}

const MOCK_SIGNALS: Signal[] = [
  { id: 1, title: 'Fed Rate Decision', content: 'Federal Reserve maintains rates at 5.25%. Markets respond positively.', signal_type: 'monetary', impact: 'high' },
  { id: 2, title: 'CPI Data Release', content: 'Inflation at 3.2% YoY, slightly below expectations.', signal_type: 'inflation', impact: 'medium' },
  { id: 3, title: 'Jobs Report', content: 'Non-farm payrolls: +180K. Unemployment steady at 3.9%.', signal_type: 'employment', impact: 'medium' },
];

export default function SignalsScreen() {
  const [signals] = useState<Signal[]>(MOCK_SIGNALS);
  const router = useRouter();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return colors.signalHigh;
      case 'medium': return colors.signalMedium;
      default: return colors.signalLow;
    }
  };

  const renderSignal = ({ item }: { item: Signal }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.impactBadge, { backgroundColor: getImpactColor(item.impact) }]}>
          <Text style={styles.impactText}>{item.impact.toUpperCase()}</Text>
        </View>
        <Text style={styles.type}>{item.signal_type}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push(`/signal/${item.id}`)}
      >
        <Text style={styles.actionButtonText}>What should I do?</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Signals</Text>
        <Text style={styles.headerSubtitle}>Max 3 per day</Text>
      </View>
      <FlatList
        data={signals}
        renderItem={renderSignal}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  impactBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  impactText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  type: { color: colors.textSecondary, fontSize: 13, textTransform: 'capitalize' },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  content: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
