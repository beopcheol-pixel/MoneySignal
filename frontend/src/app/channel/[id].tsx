import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { channels } from '../../services/api';
import { colors } from '../../theme/colors';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function ChannelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await channels.getPosts(Number(id));
        setPosts(data);
      } catch {
        setPosts([
          { id: 1, title: 'Weekly Market Recap', content: 'S&P 500 up 2.3% this week. Tech leads gains. Energy sector lags.', created_at: new Date().toISOString() },
          { id: 2, title: 'Earnings Season Preview', content: 'Big Tech earnings next week. Watch AAPL, MSFT, GOOGL closely.', created_at: new Date().toISOString() },
        ]);
      }
    };
    load();
  }, [id]);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Channel' }} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  content: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  time: { fontSize: 12, color: colors.textMuted, marginTop: 12 },
});
