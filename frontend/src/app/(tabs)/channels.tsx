import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { channels as channelsApi } from '../../services/api';
import { colors } from '../../theme/colors';

interface Channel {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export default function ChannelsScreen() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await channelsApi.getAll();
        setChannels(data);
      } catch {
        setChannels([
          { id: 1, name: 'Market Insights', description: 'Daily market analysis and trends', icon: '📊' },
          { id: 2, name: 'Crypto Watch', description: 'Cryptocurrency news and signals', icon: '₿' },
          { id: 3, name: 'Global Macro', description: 'Macroeconomic events worldwide', icon: '🌍' },
        ]);
      }
    };
    load();
  }, []);

  const renderChannel = ({ item }: { item: Channel }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/channel/${item.id}`)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Channels</Text>
        <Text style={styles.headerSubtitle}>Read-only expert insights</Text>
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
  icon: { fontSize: 32, marginRight: 16 },
  cardContent: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  arrow: { fontSize: 24, color: colors.textMuted },
});
