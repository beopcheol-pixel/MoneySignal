import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

interface UserStats {
  signalsRead: number;
  checkinsCompleted: number;
  daysStreak: number;
  totalSaved: string;
}

interface FinancialProfile {
  incomeRange: string;
  investmentStyle: string;
  riskTolerance: string;
  goals: string[];
}

const MOCK_USER = {
  name: 'Demo User',
  email: 'demo@moneysignal.app',
  avatar: '😊',
  isPro: true,
  memberSince: 'Jan 2024',
};

const MOCK_STATS: UserStats = {
  signalsRead: 47,
  checkinsCompleted: 12,
  daysStreak: 8,
  totalSaved: '$2,450',
};

const MOCK_PROFILE: FinancialProfile = {
  incomeRange: '$50k - $100k',
  investmentStyle: 'Moderate Growth',
  riskTolerance: 'Medium',
  goals: ['Retirement', 'Emergency Fund', 'House Down Payment'],
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user] = useState(MOCK_USER);
  const [stats] = useState(MOCK_STATS);
  const [profile] = useState(MOCK_PROFILE);

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{user.avatar}</Text>
          {user.isPro && <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>}
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.signalsRead}</Text>
          <Text style={styles.statLabel}>Signals Read</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.daysStreak}</Text>
          <Text style={styles.statLabel}>Day Streak 🔥</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.checkinsCompleted}</Text>
          <Text style={styles.statLabel}>Check-ins</Text>
        </View>
      </View>

      {/* Savings Card */}
      <View style={styles.savingsCard}>
        <View style={styles.savingsHeader}>
          <Text style={styles.savingsIcon}>💰</Text>
          <View>
            <Text style={styles.savingsLabel}>Total Saved (Tracked)</Text>
            <Text style={styles.savingsValue}>{stats.totalSaved}</Text>
          </View>
        </View>
        <View style={styles.savingsProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% to your $5,000 goal</Text>
        </View>
      </View>

      {/* Financial Profile */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financial Profile</Text>
          <TouchableOpacity>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <ProfileRow icon="💵" label="Income Range" value={profile.incomeRange} />
          <ProfileRow icon="📈" label="Investment Style" value={profile.investmentStyle} />
          <ProfileRow icon="⚖️" label="Risk Tolerance" value={profile.riskTolerance} />
          <View style={styles.goalsRow}>
            <Text style={styles.goalsIcon}>🎯</Text>
            <View style={styles.goalsContent}>
              <Text style={styles.goalsLabel}>Goals</Text>
              <View style={styles.goalsTags}>
                {profile.goals.map((goal, i) => (
                  <View key={i} style={styles.goalTag}>
                    <Text style={styles.goalTagText}>{goal}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <MenuItem icon="🔔" label="Notifications" value="On" />
          <MenuItem icon="🌙" label="Dark Mode" value="On" />
          <MenuItem icon="🔒" label="Privacy" />
          <MenuItem icon="❓" label="Help & Support" />
          <MenuItem icon="📄" label="Terms of Service" />
        </View>
      </View>

      {/* Subscription */}
      {!user.isPro ? (
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeIcon}>⭐</Text>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
            <Text style={styles.upgradeSubtitle}>Unlimited signals, AI coaching & more</Text>
          </View>
          <Text style={styles.upgradeArrow}>›</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.proCard}>
          <Text style={styles.proCardIcon}>⭐</Text>
          <View style={styles.proCardContent}>
            <Text style={styles.proCardTitle}>Pro Member</Text>
            <Text style={styles.proCardSubtitle}>All features unlocked</Text>
          </View>
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MoneySignal v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

function ProfileRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileIcon}>{icon}</Text>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

function MenuItem({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', padding: 24, paddingTop: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { fontSize: 60 },
  proBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  proBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 12 },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  memberSince: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  savingsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  savingsHeader: { flexDirection: 'row', alignItems: 'center' },
  savingsIcon: { fontSize: 32, marginRight: 12 },
  savingsLabel: { fontSize: 13, color: colors.textMuted },
  savingsValue: { fontSize: 28, fontWeight: '700', color: colors.success, marginTop: 2 },
  savingsProgress: { marginTop: 16 },
  progressBar: { height: 8, backgroundColor: colors.cardLight, borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: colors.success, borderRadius: 4 },
  progressText: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  section: { padding: 16, paddingBottom: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginLeft: 4 },
  editButton: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileIcon: { fontSize: 18, marginRight: 12 },
  profileLabel: { flex: 1, fontSize: 15, color: colors.textSecondary },
  profileValue: { fontSize: 15, color: colors.text, fontWeight: '500' },
  goalsRow: { flexDirection: 'row', padding: 16 },
  goalsIcon: { fontSize: 18, marginRight: 12, marginTop: 2 },
  goalsContent: { flex: 1 },
  goalsLabel: { fontSize: 15, color: colors.textSecondary, marginBottom: 8 },
  goalsTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalTag: { backgroundColor: colors.cardLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  goalTagText: { fontSize: 13, color: colors.text },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: colors.text },
  menuValue: { fontSize: 14, color: colors.textMuted, marginRight: 8 },
  menuArrow: { fontSize: 20, color: colors.textMuted },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  upgradeIcon: { fontSize: 24, marginRight: 12 },
  upgradeContent: { flex: 1 },
  upgradeTitle: { fontSize: 17, fontWeight: '600', color: '#fff' },
  upgradeSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  upgradeArrow: { fontSize: 24, color: '#fff' },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  proCardIcon: { fontSize: 24, marginRight: 12 },
  proCardContent: { flex: 1 },
  proCardTitle: { fontSize: 17, fontWeight: '600', color: colors.primary },
  proCardSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: '600' },
  footer: { alignItems: 'center', padding: 20, paddingBottom: 40 },
  footerText: { fontSize: 12, color: colors.textMuted },
});
