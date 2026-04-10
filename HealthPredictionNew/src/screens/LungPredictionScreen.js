import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { PrimaryButton, Card, Divider, LoadingOverlay } from '../components/UIComponents';
import { predictionService } from '../services/predictionService';
import { COLORS, SPACING, RADIUS } from '../../config';

// 13 Yes/No symptom fields (sent as 2=Yes, 1=No to match dataset encoding)
const SYMPTOM_FIELDS = [
  { key: 'smoking',              label: 'Smoking',                icon: '🚬', desc: 'Current or history of smoking' },
  { key: 'yellow_fingers',       label: 'Yellow Fingers',         icon: '🖐️', desc: 'Yellowing of fingernails or fingers' },
  { key: 'anxiety',              label: 'Anxiety',                icon: '😰', desc: 'Frequent anxiety episodes' },
  { key: 'peer_pressure',        label: 'Peer Pressure',          icon: '👥', desc: 'Influenced by peer pressure (e.g. smoking)' },
  { key: 'chronic_disease',      label: 'Chronic Disease',        icon: '🏥', desc: 'Pre-existing chronic illness' },
  { key: 'fatigue',              label: 'Fatigue',                icon: '😴', desc: 'Persistent tiredness or weakness' },
  { key: 'allergy',              label: 'Allergy',                icon: '🤧', desc: 'Known allergies' },
  { key: 'wheezing',             label: 'Wheezing',               icon: '💨', desc: 'Whistling sound while breathing' },
  { key: 'alcohol_consuming',    label: 'Alcohol Consuming',      icon: '🍺', desc: 'Regular alcohol consumption' },
  { key: 'coughing',             label: 'Coughing',               icon: '😷', desc: 'Persistent or chronic cough' },
  { key: 'shortness_of_breath',  label: 'Shortness of Breath',    icon: '🫁', desc: 'Difficulty breathing or breathlessness' },
  { key: 'swallowing_difficulty', label: 'Swallowing Difficulty', icon: '🍽️', desc: 'Difficulty swallowing food or liquids' },
  { key: 'chest_pain',           label: 'Chest Pain',             icon: '💔', desc: 'Chest pain or discomfort' },
];

const RISK_COLOR = { Low: COLORS.success, Medium: COLORS.warning, High: COLORS.danger };
const RISK_BG    = { Low: COLORS.successLight, Medium: COLORS.warningLight, High: COLORS.dangerLight };

const INITIAL = {
  age: '',
  ...Object.fromEntries(SYMPTOM_FIELDS.map(f => [f.key, null])),
};

const LungPredictionScreen = ({ navigation }) => {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  const update = (key, val) => { setForm(p => ({ ...p, [key]: val })); setResult(null); };

  const validate = () => {
    if (!form.age || isNaN(Number(form.age))) return 'Please enter a valid age.';
    for (const f of SYMPTOM_FIELDS) {
      if (form[f.key] === null) return `Please answer: ${f.label}`;
    }
    return null;
  };

  const handlePredict = async () => {
    const err = validate();
    if (err) return Alert.alert('Incomplete Form', err);
    setLoading(true);
    try {
      const payload = {
        age: parseFloat(form.age),
        ...Object.fromEntries(SYMPTOM_FIELDS.map(f => [f.key, form[f.key]])),
      };
      const data = await predictionService.lung(payload);
      setResult(data);
    } catch (e) {
      Alert.alert('Prediction Failed', e.response?.data?.detail || 'Could not connect to the server.');
    } finally { setLoading(false); }
  };

  const reset = () => { setForm(INITIAL); setResult(null); };

  const riskLevel  = result?.risk_level || '';
  const riskColor  = RISK_COLOR[riskLevel] || COLORS.primary;
  const riskBg     = RISK_BG[riskLevel]    || COLORS.primaryLight;
  const answered   = SYMPTOM_FIELDS.filter(f => form[f.key] !== null).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {loading && <LoadingOverlay message="Running lung cancer risk model…" />}
      <ScreenHeader title="Lung Cancer Risk" subtitle="14 parameters · SVM + Ensemble" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Progress bar */}
        <View style={s.progressWrap}>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${(answered / SYMPTOM_FIELDS.length) * 100}%` }]} />
          </View>
          <Text style={s.progressTxt}>{answered}/{SYMPTOM_FIELDS.length} symptoms answered</Text>
        </View>

        {/* Result */}
        {result && (
          <View style={[s.resultCard, { backgroundColor: riskBg, borderColor: riskColor }]}>
            <Text style={s.resultEmoji}>{riskLevel === 'High' ? '🚨' : riskLevel === 'Medium' ? '⚠️' : '✅'}</Text>
            <Text style={[s.riskLevel, { color: riskColor }]}>{riskLevel} Risk</Text>
            {result.risk_percentage != null && (
              <Text style={[s.riskPct, { color: riskColor }]}>{result.risk_percentage.toFixed(1)}% probability</Text>
            )}
            <Text style={[s.riskSub, { color: riskColor }]}>
              {riskLevel === 'High'   ? 'High lung cancer risk. Immediate medical consultation recommended.' :
               riskLevel === 'Medium' ? 'Moderate risk detected. Schedule a check-up with your physician.' :
                                        'Low lung cancer risk. Continue with regular health screenings.'}
            </Text>
          </View>
        )}

        {/* Age input */}
        <Card>
          <Text style={s.cardTitle}>Patient Information</Text>
          <Divider />
          <View style={s.field}>
            <View style={s.fieldTop}>
              <Text style={s.fieldLabel}>Age</Text>
              <View style={s.unitPill}><Text style={s.unitTxt}>years</Text></View>
            </View>
            <TextInput
              style={s.input}
              value={form.age}
              onChangeText={v => update('age', v)}
              placeholder="e.g. 45"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
            />
          </View>
        </Card>

        {/* Symptom toggles */}
        <Card>
          <Text style={s.cardTitle}>Symptoms & Risk Factors</Text>
          <Text style={s.cardSub}>Tap Yes or No for each factor</Text>
          <Divider />
          {SYMPTOM_FIELDS.map((f, i) => (
            <View key={f.key} style={[s.symptomRow, i < SYMPTOM_FIELDS.length - 1 && s.symptomBorder]}>
              <Text style={s.symptomIcon}>{f.icon}</Text>
              <View style={s.symptomMeta}>
                <Text style={s.symptomLabel}>{f.label}</Text>
                <Text style={s.symptomDesc}>{f.desc}</Text>
              </View>
              <View style={s.yesNoRow}>
                {/* 2=Yes, 1=No (standard lung cancer dataset encoding) */}
                <TouchableOpacity
                  style={[s.yesNoBtn, form[f.key] === 1 && s.noActive]}
                  onPress={() => update(f.key, 1)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.yesNoTxt, form[f.key] === 1 && s.noTxtActive]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.yesNoBtn, form[f.key] === 2 && s.yesActive]}
                  onPress={() => update(f.key, 2)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.yesNoTxt, form[f.key] === 2 && s.yesTxtActive]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Card>

        <PrimaryButton title="🫁  Assess Lung Cancer Risk" onPress={handlePredict} />
        {result && <TouchableOpacity style={s.resetRow} onPress={reset}><Text style={s.resetTxt}>Clear & Reset Form</Text></TouchableOpacity>}
        <View style={s.disclaimer}><Text style={s.disclaimerTxt}>⚕ For clinical decision support only. Not a medical diagnosis.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.background },
  content:       { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  progressWrap:  { gap: 6 },
  progressBar:   { height: 6, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full },
  progressTxt:   { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  resultCard:    { borderRadius: RADIUS.xl, borderWidth: 1.5, padding: SPACING.lg, alignItems: 'center', gap: 6 },
  resultEmoji:   { fontSize: 52 },
  riskLevel:     { fontSize: 28, fontWeight: '800', letterSpacing: -0.4 },
  riskPct:       { fontSize: 18, fontWeight: '700' },
  riskSub:       { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500', marginTop: 2 },
  cardTitle:     { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  cardSub:       { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  field:         { marginTop: SPACING.sm },
  fieldTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  fieldLabel:    { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  unitPill:      { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  unitTxt:       { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  input:         { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 12, fontSize: 15, color: COLORS.textPrimary },
  symptomRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: SPACING.sm },
  symptomBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  symptomIcon:   { fontSize: 22, width: 32, textAlign: 'center' },
  symptomMeta:   { flex: 1 },
  symptomLabel:  { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  symptomDesc:   { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  yesNoRow:      { flexDirection: 'row', gap: 6 },
  yesNoBtn:      { width: 46, height: 34, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  yesActive:     { backgroundColor: COLORS.danger,  borderColor: COLORS.danger },
  noActive:      { backgroundColor: COLORS.success, borderColor: COLORS.success },
  yesNoTxt:      { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  yesTxtActive:  { color: COLORS.white },
  noTxtActive:   { color: COLORS.white },
  resetRow:      { alignItems: 'center', paddingVertical: SPACING.xs },
  resetTxt:      { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  disclaimer:    { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.md },
  disclaimerTxt: { fontSize: 12, color: COLORS.primary, lineHeight: 18, fontWeight: '500' },
});

export default LungPredictionScreen;