import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const MODELS = [
  {
    icon: '💉', name: 'Diabetes',         route: 'Diabetes',
    desc: 'Predict diabetes risk from glucose, BMI, insulin, and clinical markers.',
    inputs: '8 clinical inputs', model: 'scikit-learn', active: true, color: '#2563EB', bg: '#EFF6FF',
  },
  {
    icon: '❤️', name: 'Heart Disease',    route: 'Heart',
    desc: 'Assess cardiovascular risk using ECG results and lab parameters.',
    inputs: '13 clinical inputs', model: 'Ensemble Model', active: true, color: '#EF4444', bg: '#FEF2F2',
  },
  {
    icon: '🫁', name: 'Lung Cancer Risk', route: 'Lung',
    desc: 'Evaluate lung cancer risk from symptoms and lifestyle factors.',
    inputs: '14 binary inputs', model: 'SVM + Ensemble', active: true, color: '#8B5CF6', bg: '#F5F3FF',
  },
  {
    icon: '🔬', name: 'Dermatosis',       route: 'Dermatosis',
    desc: 'CNN-based skin lesion classification from photos. Clinical validation in progress.',
    inputs: 'Image upload', model: 'PyTorch CNN', active: false, color: COLORS.textMuted, bg: COLORS.background,
  },
  {
    icon: '🩻', name: 'Pneumonia',        route: 'Pneumonia',
    desc: 'Detect pneumonia from chest X-ray images using deep learning.',
    inputs: 'X-Ray image', model: 'PyTorch CNN', active: false, color: COLORS.textMuted, bg: COLORS.background,
  },
];

const PredictScreen = ({ navigation }) => (
  <SafeAreaView style={s.safe} edges={['top']}>
    <View style={s.header}>
      <Text style={s.headerTitle}>Disease Prediction</Text>
      <Text style={s.headerSub}>Select a model to begin AI assessment</Text>
    </View>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {MODELS.map(m => (
        <TouchableOpacity
          key={m.name}
          style={[s.card, { backgroundColor: m.bg }, !m.active && s.cardOff]}
          onPress={() => m.active && navigation.navigate(m.route)}
          activeOpacity={m.active ? 0.8 : 1}
        >
          <View style={s.top}>
            <View style={[s.iconWrap, { backgroundColor: m.color + '1A' }]}>
              <Text style={s.icon}>{m.icon}</Text>
            </View>
            <View style={s.titleBlock}>
              <Text style={[s.name, !m.active && s.nameMuted]}>{m.name}</Text>
              <View style={[s.badge, { backgroundColor: m.active ? COLORS.success + '1A' : COLORS.border }]}>
                <Text style={[s.badgeTxt, { color: m.active ? COLORS.success : COLORS.textMuted }]}>
                  {m.active ? '● Live' : '○ Coming Soon'}
                </Text>
              </View>
            </View>
            {m.active && <Text style={s.arrow}>›</Text>}
          </View>
          <Text style={[s.desc, !m.active && s.descMuted]}>{m.desc}</Text>
          <View style={s.meta}>
            <View style={s.metaItem}>
              <Text style={s.metaKey}>INPUTS</Text>
              <Text style={s.metaVal}>{m.inputs}</Text>
            </View>
            <View style={s.metaDivider} />
            <View style={s.metaItem}>
              <Text style={s.metaKey}>MODEL</Text>
              <Text style={s.metaVal}>{m.model}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </SafeAreaView>
);

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.background },
  header:      { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4 },
  headerSub:   { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  content:     { padding: SPACING.md, gap: SPACING.sm, paddingBottom: 60 },
  card:        { borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  cardOff:     { opacity: 0.6 },
  top:         { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  iconWrap:    { width: 52, height: 52, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  icon:        { fontSize: 28 },
  titleBlock:  { flex: 1 },
  name:        { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  nameMuted:   { color: COLORS.textSecondary },
  badge:       { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeTxt:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  arrow:       { fontSize: 26, color: COLORS.textMuted },
  desc:        { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.sm },
  descMuted:   { color: COLORS.textMuted },
  meta:        { flexDirection: 'row', alignItems: 'center' },
  metaItem:    { flex: 1 },
  metaKey:     { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.5 },
  metaVal:     { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginTop: 2 },
  metaDivider: { width: 1, height: 28, backgroundColor: COLORS.border, marginHorizontal: SPACING.md },
});

export default PredictScreen;