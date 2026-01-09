import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '../../theme/colors';

interface Post {
  id: number;
  title: string;
  content: string;
  time: string;
  readTime: string;
}

const CHANNEL_DATA: Record<string, { name: string; icon: string; posts: Post[] }> = {
  '1': {
    name: 'Market Insights',
    icon: '📊',
    posts: [
      { id: 1, title: 'Weekly Market Recap', content: 'S&P 500 up 2.3% this week. Tech leads gains with NVDA +8%. Energy sector lags as oil prices stabilize. Watch for Fed minutes next week.', time: '2h ago', readTime: '2 min' },
      { id: 2, title: 'Earnings Season Preview', content: 'Big Tech earnings next week. AAPL expected to report iPhone sales recovery. MSFT Azure growth in focus. GOOGL ad revenue under scrutiny.', time: '5h ago', readTime: '3 min' },
      { id: 3, title: 'Sector Rotation Alert', content: 'Money flowing from growth to value stocks. Financials and industrials gaining momentum. Consider rebalancing if overweight tech.', time: '8h ago', readTime: '2 min' },
    ],
  },
  '2': {
    name: 'Crypto Watch',
    icon: '₿',
    posts: [
      { id: 1, title: 'Bitcoin ETF Inflows Surge', content: 'Spot Bitcoin ETFs saw $500M inflows this week. BlackRock IBIT leads the pack. Institutional adoption accelerating.', time: '1h ago', readTime: '2 min' },
      { id: 2, title: 'Ethereum Upgrade Coming', content: 'EIP-4844 implementation on track. Expected to reduce L2 fees by 10x. Bullish for Arbitrum, Optimism ecosystem.', time: '4h ago', readTime: '3 min' },
      { id: 3, title: 'Altcoin Season Indicators', content: 'Bitcoin dominance falling below 50%. Historically signals altcoin rally. SOL, AVAX showing relative strength.', time: '6h ago', readTime: '2 min' },
    ],
  },
  '3': {
    name: 'Global Macro',
    icon: '🌍',
    posts: [
      { id: 1, title: 'ECB Rate Decision Preview', content: 'European Central Bank expected to hold rates. Inflation cooling faster than US. EUR/USD could see volatility.', time: '3h ago', readTime: '3 min' },
      { id: 2, title: 'China Economic Data Mixed', content: 'Manufacturing PMI at 50.2, barely in expansion. Property sector remains weak. Stimulus measures likely to continue.', time: '7h ago', readTime: '2 min' },
    ],
  },
  '4': {
    name: 'Tech Stocks',
    icon: '💻',
    posts: [
      { id: 1, title: 'AI Chip Wars Heat Up', content: 'AMD MI300 gaining traction against NVIDIA. Intel entering the race. Semiconductor capex at record highs.', time: '2h ago', readTime: '3 min' },
      { id: 2, title: 'Cloud Growth Slowing?', content: 'AWS, Azure, GCP all seeing deceleration. Enterprises optimizing spend. AI workloads providing new growth driver.', time: '5h ago', readTime: '2 min' },
    ],
  },
  '5': {
    name: 'Dividend Income',
    icon: '💰',
    posts: [
      { id: 1, title: 'Top Dividend Aristocrats', content: 'Companies with 25+ years of dividend growth. JNJ, PG, KO remain stalwarts. Yields averaging 2.8% with reliable growth.', time: '4h ago', readTime: '3 min' },
    ],
  },
};

export default function ChannelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const channel = CHANNEL_DATA[id || '1'] || CHANNEL_DATA['1'];

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.readTime}>{item.readTime} read</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: channel.name }} />

      <View style={styles.channelHeader}>
        <Text style={styles.channelIcon}>{channel.icon}</Text>
        <Text style={styles.channelName}>{channel.name}</Text>
      </View>

      <FlatList
        data={channel.posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  channelIcon: { fontSize: 32, marginRight: 12 },
  channelName: { fontSize: 22, fontWeight: '700', color: colors.text },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  time: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  readTime: { fontSize: 13, color: colors.textMuted },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  content: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
});
