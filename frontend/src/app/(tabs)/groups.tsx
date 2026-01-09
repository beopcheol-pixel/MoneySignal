import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

interface Group {
  id: number;
  name: string;
  description: string;
  icon: string;
  members: number;
  activeNow: number;
  lastActivity: string;
  isJoined: boolean;
}

const MOCK_GROUPS: Group[] = [
  { id: 1, name: 'Beginner Investors', description: 'Learn the basics of investing together', icon: '🌱', members: 1248, activeNow: 23, lastActivity: '2m ago', isJoined: true },
  { id: 2, name: 'Dividend Hunters', description: 'Focus on dividend growth strategies', icon: '💵', members: 892, activeNow: 15, lastActivity: '5m ago', isJoined: true },
  { id: 3, name: 'Tech Stock Club', description: 'Discuss technology sector investments', icon: '💻', members: 1567, activeNow: 42, lastActivity: 'Just now', isJoined: false },
  { id: 4, name: 'Crypto Curious', description: 'Learn about cryptocurrency safely', icon: '🪙', members: 734, activeNow: 18, lastActivity: '10m ago', isJoined: false },
  { id: 5, name: 'Retirement Planners', description: '401k, IRA, and long-term strategies', icon: '🏖️', members: 456, activeNow: 8, lastActivity: '15m ago', isJoined: false },
];

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const router = useRouter();

  const toggleJoin = (id: number) => {
    setGroups(prev => prev.map(g =>
      g.id === id ? { ...g, isJoined: !g.isJoined, members: g.isJoined ? g.members - 1 : g.members + 1 } : g
    ));
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardMain}
        onPress={() => router.push(`/group/${item.id}`)}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.stats}>
            <Text style={styles.members}>{item.members.toLocaleString()} members</Text>
            <View style={styles.dot} />
            <View style={styles.activeIndicator}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>{item.activeNow} active</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <Text style={styles.lastActivity}>{item.lastActivity}</Text>
        <TouchableOpacity
          style={[styles.joinButton, item.isJoined && styles.joinedButton]}
          onPress={() => toggleJoin(item.id)}
        >
          <Text style={[styles.joinButtonText, item.isJoined && styles.joinedButtonText]}>
            {item.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const joinedGroups = groups.filter(g => g.isJoined);
  const discoverGroups = groups.filter(g => !g.isJoined);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
        <Text style={styles.headerSubtitle}>Community discussions & weekly check-ins</Text>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            {joinedGroups.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Groups</Text>
                {joinedGroups.map(item => (
                  <View key={item.id}>{renderGroup({ item })}</View>
                ))}
              </View>
            )}

            {discoverGroups.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Discover</Text>
                {discoverGroups.map(item => (
                  <View key={item.id}>{renderGroup({ item })}</View>
                ))}
              </View>
            )}
          </>
        }
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
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: 12, marginLeft: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardMain: { flexDirection: 'row' },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 24 },
  cardContent: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  members: { fontSize: 12, color: colors.textMuted },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted, marginHorizontal: 8 },
  activeIndicator: { flexDirection: 'row', alignItems: 'center' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 4 },
  activeText: { fontSize: 12, color: colors.success },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lastActivity: { fontSize: 12, color: colors.textMuted },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  joinButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  joinedButtonText: { color: colors.textSecondary },
});
