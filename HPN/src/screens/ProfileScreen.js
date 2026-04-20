import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { DangerButton, Card, Divider } from '../components/UIComponents';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const ROW = ({ label, value }) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={s.rowValue}>{value || '—'}</Text>
  </View>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const initial = user?.username?.charAt(0)?.toUpperCase() || '?';

  const confirmLogout = () => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign Out', style: 'destructive', onPress: logout },
  ]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.headerTitle}>Profile</Text></View>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.avatarSection}>
          <View style={s.avatar}><Text style={s.avatarTxt}>{initial}</Text></View>
          <Text style={s.uname}>{user?.username || 'User'}</Text>
          <Text style={s.email}>{user?.email || ''}</Text>
          <View style={s.roleBadge}><Text style={s.roleTxt}>Healthcare Professional</Text></View>
        </View>
        <Card style={s.infoCard}>
          <Text style={s.sectionTitle}>Account Details</Text>
          <Divider />
          <ROW label="Username"     value={user?.username} />
          <ROW label="Email"        value={user?.email} />
          <ROW label="Account Type" value="Standard" />
          <ROW label="Platform"     value="Cognitive Health AI v1.0" />
        </Card>
        <Card style={s.capCard}>
          <Text style={s.sectionTitle}>Available Capabilities</Text>
          <Divider />
          {['Diabetes Prediction','Heart Disease Analysis','Lung Cancer Risk','Medical Report OCR','AI Health Chat'].map(c => (
            <View key={c} style={s.capRow}>
              <Text style={s.capDot}>✓</Text>
              <Text style={s.capTxt}>{c}</Text>
            </View>
          ))}
        </Card>
        <DangerButton title="Sign Out" onPress={confirmLogout} style={s.logoutBtn} />
        <Text style={s.disclaimer}>Results are for decision-support only. Always consult a qualified clinician.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm, ...SHADOW.md },
  avatarTxt: { fontSize: 34, fontWeight: '700', color: COLORS.white },
  uname: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  email: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  roleBadge: { marginTop: SPACING.sm, backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.full },
  roleTxt: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  infoCard: { marginBottom: SPACING.sm },
  capCard: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  rowValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: SPACING.sm },
  capRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: SPACING.sm },
  capDot: { fontSize: 14, color: COLORS.success, fontWeight: '800' },
  capTxt: { fontSize: 14, color: COLORS.textPrimary },
  logoutBtn: { marginBottom: SPACING.md },
  disclaimer: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
});

export default ProfileScreen;