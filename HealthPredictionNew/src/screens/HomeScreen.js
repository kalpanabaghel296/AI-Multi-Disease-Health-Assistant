import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/UIComponents';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const QUICK_ACCESS = [
  { icon: '🧬', label: 'Predict',   sub: 'Diabetes · Heart · Lung', tab: 'Predict',   bg: '#EFF6FF', border: '#BFDBFE' },
  { icon: '📋', label: 'Reports',   sub: 'Upload & Extract',         tab: 'Upload',    bg: '#F0FDF4', border: '#BBF7D0' },
  { icon: '🤖', label: 'Assistant', sub: 'Ask AI anything',          tab: 'Assistant', bg: '#FFF7ED', border: '#FED7AA' },
];

const DISEASES = [
  { icon: '💉', label: 'Diabetes',         route: 'Diabetes',   active: true,  color: COLORS.primary },
  { icon: '❤️', label: 'Heart Disease',    route: 'Heart',      active: true,  color: '#EF4444' },
  { icon: '🫁', label: 'Lung Cancer Risk', route: 'Lung',       active: true,  color: '#8B5CF6' },
  { icon: '🔬', label: 'Dermatosis',       route: 'Dermatosis', active: true, color: '#EF4444' },
  { icon: '🩻', label: 'Pneumonia',        route: 'Pneumonia',  active: true, color: '#8B5CF6' },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Blue top header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting} 👋</Text>
          <Text style={s.username}>{user?.username || 'User'}</Text>
        </View>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{user?.username?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Banner */}
        <View style={s.banner}>
          <View style={s.bannerLeft}>
            <Text style={s.bannerTitle}>AI Health Platform</Text>
            <Text style={s.bannerSub}>ML + LLM for clinical decision support</Text>
          </View>
          <Text style={s.bannerIcon}>🩺</Text>
        </View>

        {/* Quick access */}
        <Text style={s.sectionTitle}>Quick Access</Text>
        <View style={s.grid}>
          {QUICK_ACCESS.map(f => (
            <TouchableOpacity
              key={f.tab}
              style={[s.gridCard, { backgroundColor: f.bg, borderColor: f.border }]}
              onPress={() => navigation.navigate(f.tab)}
              activeOpacity={0.8}
            >
              <Text style={s.gridIcon}>{f.icon}</Text>
              <Text style={s.gridLabel}>{f.label}</Text>
              <Text style={s.gridSub}>{f.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disease list */}
        <Text style={s.sectionTitle}>Disease Predictions</Text>
        <Card>
          {DISEASES.map((d, i) => (
            <TouchableOpacity
              key={d.label}
              style={[s.diseaseRow, i < DISEASES.length - 1 && s.rowBorder]}
              onPress={() => d.active && navigation.navigate('Predict', { screen: d.route })}
              activeOpacity={d.active ? 0.7 : 1}
            >
              <View style={[s.diseaseIconBg, { backgroundColor: d.color + '18' }]}>
                <Text style={s.diseaseIcon}>{d.icon}</Text>
              </View>
              <View style={s.diseaseMeta}>
                <Text style={[s.diseaseName, !d.active && s.muted]}>{d.label}</Text>
                <Text style={[s.diseaseStatus, { color: d.active ? COLORS.success : COLORS.textMuted }]}>
                  {d.active ? '● Available' : '○ Coming Soon'}
                </Text>
              </View>
              {d.active && <Text style={s.arrow}>›</Text>}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Disclaimer */}
        <View style={s.info}>
          <Text style={s.infoIcon}>⚕️</Text>
          <Text style={s.infoTxt}>
            All predictions are for clinical decision support only. Always consult a qualified healthcare professional.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.background },
  header:       { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting:     { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  username:     { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: -0.4 },
  avatar:       { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  avatarTxt:    { fontSize: 18, fontWeight: '800', color: COLORS.white },
  content:      { padding: SPACING.md, paddingBottom: 60, gap: SPACING.md },
  banner:       { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...SHADOW.md },
  bannerLeft:   { flex: 1, paddingRight: SPACING.sm },
  bannerTitle:  { fontSize: 18, fontWeight: '800', color: COLORS.white },
  bannerSub:    { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, lineHeight: 18 },
  bannerIcon:   { fontSize: 52 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  grid:         { flexDirection: 'row', gap: SPACING.sm },
  gridCard:     { flex: 1, borderRadius: RADIUS.lg, borderWidth: 1.5, padding: SPACING.sm, ...SHADOW.sm },
  gridIcon:     { fontSize: 26, marginBottom: 6 },
  gridLabel:    { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  gridSub:      { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  diseaseRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.sm },
  rowBorder:    { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  diseaseIconBg:{ width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  diseaseIcon:  { fontSize: 22 },
  diseaseMeta:  { flex: 1 },
  diseaseName:  { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  muted:        { color: COLORS.textMuted },
  diseaseStatus:{ fontSize: 12, marginTop: 2, fontWeight: '500' },
  arrow:        { fontSize: 22, color: COLORS.textMuted },
  info:         { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.primary + '33' },
  infoIcon:     { fontSize: 18 },
  infoTxt:      { flex: 1, fontSize: 12, color: COLORS.primary, lineHeight: 18, fontWeight: '500' },
});

export default HomeScreen;