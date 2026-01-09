import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

interface Channel {
  id: number;
  name: string;
  description: string;
  icon: string;
  subscribers: string;
  postsToday: number;
}

const MOCK_CHANNELS: Channel[] = [
  { id: 1, name: 'Market Insights', description: 'Daily market analysis and trends', icon: '📊', subscribers: '12.5K', postsToday: 3 },
  { id: 2, name: 'Crypto Watch', description: 'Cryptocurrency news and signals', icon: '₿', subscribers: '8.2K', postsToday: 5 },
  { id: 3, name: 'Global Macro', description: 'Macroeconomic events worldwide', icon: '🌍', subscribers: '6.8K', postsToday: 2 },
  { id: 4, name: 'Tech Stocks', description: 'Technology sector updates', icon: '💻', subscribers: '9.1K', postsToday: 4 },
  { id: 5, name: 'Dividend Income', description: 'Dividend investing strategies', icon: '💰', subscribers: '5.4K', postsToday: 1 },
];

export default function ChannelsScreen() {
  const [channels] = useState<Channel[]>(MOCK_CHANNELS);
  const router = useRouter();

  const renderChannel = ({ item }: { item: Channel }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/channel/${item.id}`)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.stats}>
          <Text style={styles.subscribers}>{item.subscribers} subscribers</Text>
          <View style={styles.dot} />
          <Text style={styles.posts}>{item.postsToday} posts today</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Channels</Text>
        <Text style={styles.headerSubtitle}>Expert insights, read-only</Text>
      </View>
      <FlatList
        data={channels}
        renderItem={renderChannel}
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 26 },
  cardContent: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  subscribers: { fontSize: 12, color: colors.primary },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted, marginHorizontal: 8 },
  posts: { fontSize: 12, color: colors.textMuted },
  arrow: { fontSize: 24, color: colors.textMuted },
});
