import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile] = useState({
    incomeRange: '$50k - $100k',
    investmentStyle: 'Moderate Growth',
    riskTolerance: 'Medium',
    goals: 'Retirement, Emergency Fund',
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.replace('/'); } },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0] || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <View style={[styles.badge, user?.isSubscribed ? styles.badgePro : styles.badgeFree]}>
          <Text style={styles.badgeText}>{user?.isSubscribed ? 'PRO' : 'FREE'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Profile</Text>
        <View style={styles.card}>
          <ProfileRow label="Income Range" value={profile.incomeRange} />
          <ProfileRow label="Investment Style" value={profile.investmentStyle} />
          <ProfileRow label="Risk Tolerance" value={profile.riskTolerance} />
          <ProfileRow label="Goals" value={profile.goals} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!user?.isSubscribed && (
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', padding: 24, paddingTop: 40 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  badgePro: { backgroundColor: colors.primary },
  badgeFree: { backgroundColor: colors.cardLight },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  section: { padding: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileLabel: { fontSize: 15, color: colors.textSecondary },
  profileValue: { fontSize: 15, color: colors.text, fontWeight: '500' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: { fontSize: 16, color: colors.text },
  arrow: { fontSize: 20, color: colors.textMuted },
  upgradeButton: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  logoutButton: { margin: 16, padding: 16, alignItems: 'center' },
  logoutText: { color: colors.error, fontSize: 17, fontWeight: '600' },
});
