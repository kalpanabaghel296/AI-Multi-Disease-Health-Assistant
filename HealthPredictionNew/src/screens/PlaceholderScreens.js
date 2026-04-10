import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const ComingSoon = ({ navigation, title, subtitle, icon, tech }) => (
  <SafeAreaView style={styles.safe} edges={['top']}>
    <ScreenHeader title={title} subtitle={subtitle} onBack={() => navigation.goBack()} />
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.sub}>This prediction model is currently in development and undergoing clinical validation.</Text>
        <View style={styles.badge}><Text style={styles.badgeTxt}>{tech}</Text></View>
      </View>
    </View>
  </SafeAreaView>
);

export const DermatosisPredictionScreen = ({ navigation }) => (
  <ComingSoon navigation={navigation} title="Dermatosis Detection" subtitle="CNN image analysis" icon="🔬" tech="PYTORCH · CNN · IMAGE ANALYSIS" />
);

export const PneumoniaPredictionScreen = ({ navigation }) => (
  <ComingSoon navigation={navigation} title="Pneumonia Detection" subtitle="Chest X-ray CNN" icon="🩻" tech="PYTORCH · CNN · X-RAY ANALYSIS" />
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, alignItems: 'center', width: '100%', ...SHADOW.md },
  icon: { fontSize: 60, marginBottom: SPACING.md },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4 },
  sub: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: SPACING.sm, marginBottom: SPACING.lg },
  badge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  badgeTxt: { fontSize: 11, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
});