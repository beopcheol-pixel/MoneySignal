import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { groups as groupsApi } from '../../services/api';
import { colors } from '../../theme/colors';

interface Group {
  id: number;
  name: string;
  description: string;
  member_count: number;
}

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await groupsApi.getAll();
        setGroups(data);
      } catch {
        setGroups([
          { id: 1, name: 'Beginner Investors', description: 'Learn the basics of investing together', member_count: 124 },
          { id: 2, name: 'Dividend Hunters', description: 'Focus on dividend growth strategies', member_count: 89 },
          { id: 3, name: 'Tech Stock Club', description: 'Discuss technology sector investments', member_count: 156 },
        ]);
      }
    };
    load();
  }, []);

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/group/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.members}>{item.member_count} members</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
        <Text style={styles.headerSubtitle}>Community discussions & weekly check-ins</Text>
      </View>
      <FlatList
        data={groups}
        renderItem={renderGroup}
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
  cardContent: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  members: { fontSize: 13, color: colors.primary, marginTop: 8 },
  arrow: { fontSize: 24, color: colors.textMuted },
});
