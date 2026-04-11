import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { PrimaryButton, Card, Divider, LoadingOverlay } from '../components/UIComponents';
import { predictionService } from '../services/predictionService';
import { COLORS, SPACING, RADIUS } from '../../config';

const FIELDS = [
  { key: 'pregnancies',       label: 'Pregnancies',        hint: 'Number of times pregnant',          unit: 'count',   placeholder: 'e.g. 2' },
  { key: 'glucose',           label: 'Glucose',            hint: '2-hr plasma glucose (OGTT)',         unit: 'mg/dL',   placeholder: 'e.g. 120' },
  { key: 'blood_pressure',    label: 'Blood Pressure',     hint: 'Diastolic blood pressure',           unit: 'mm Hg',   placeholder: 'e.g. 80' },
  { key: 'skin_thickness',    label: 'Skin Thickness',     hint: 'Triceps skinfold thickness',         unit: 'mm',      placeholder: 'e.g. 20' },
  { key: 'insulin',           label: 'Insulin',            hint: '2-hr serum insulin level',           unit: 'μU/mL',   placeholder: 'e.g. 80' },
  { key: 'bmi',               label: 'BMI',                hint: 'Body Mass Index (weight/height²)',   unit: 'kg/m²',   placeholder: 'e.g. 26.5' },
  { key: 'diabetes_pedigree', label: 'Diabetes Pedigree',  hint: 'Family history diabetes function',   unit: 'score',   placeholder: 'e.g. 0.47' },
  { key: 'age',               label: 'Age',                hint: 'Patient age in years',               unit: 'years',   placeholder: 'e.g. 35' },
];

const INITIAL = Object.fromEntries(FIELDS.map(f => [f.key, '']));

const DiabetesPredictionScreen = ({ navigation }) => {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  const update = (key, val) => { setForm(p => ({ ...p, [key]: val })); setResult(null); };

  const validate = () => {
    for (const f of FIELDS) {
      if (form[f.key] === '') return `Please enter a value for ${f.label}.`;
      if (isNaN(Number(form[f.key]))) return `${f.label} must be a valid number.`;
    }
    return null;
  };

  const handlePredict = async () => {
    const err = validate();
    if (err) return Alert.alert('Incomplete Form', err);
    setLoading(true);
    try {
      const payload = Object.fromEntries(FIELDS.map(f => [f.key, parseFloat(form[f.key])]));
      const data = await predictionService.diabetes(payload);
      setResult(data);
    } catch (e) {
      Alert.alert('Prediction Failed', e.response?.data?.detail || 'Could not connect to the server. Check your connection.');
    } finally { setLoading(false); }
  };

  const reset = () => { setForm(INITIAL); setResult(null); };

  const isDiabetic = result?.prediction === 1;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {loading && <LoadingOverlay message="Running diabetes model…" />}
      <ScreenHeader title="Diabetes Prediction" subtitle="8 clinical parameters" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Result */}
        {result && (
          <View style={[s.resultCard, isDiabetic ? s.resultRed : s.resultGreen]}>
            <Text style={s.resultEmoji}>{isDiabetic ? '⚠️' : '✅'}</Text>
            <Text style={[s.resultLabel, { color: isDiabetic ? COLORS.danger : COLORS.success }]}>
              {result.result}
            </Text>
            <Text style={[s.resultSub, { color: isDiabetic ? COLORS.danger : COLORS.success }]}>
              {isDiabetic
                ? 'Elevated diabetes risk detected. Please consult a physician.'
                : 'No diabetes risk detected. Maintain a healthy lifestyle.'}
            </Text>
          </View>
        )}

        <Card>
          <Text style={s.cardTitle}>Clinical Parameters</Text>
          <Text style={s.cardSub}>Enter values from recent lab results or clinical assessment</Text>
          <Divider />
          {FIELDS.map(f => (
            <View key={f.key} style={s.field}>
              <View style={s.fieldTop}>
                <Text style={s.fieldLabel}>{f.label}</Text>
                <View style={s.unitPill}><Text style={s.unitTxt}>{f.unit}</Text></View>
              </View>
              <Text style={s.fieldHint}>{f.hint}</Text>
              <TextInput
                style={s.input}
                value={form[f.key]}
                onChangeText={v => update(f.key, v)}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
          ))}
        </Card>

        <PrimaryButton title="🧬  Run Diabetes Prediction" onPress={handlePredict} />

        {result && (
          <TouchableOpacity style={s.resetRow} onPress={reset}>
            <Text style={s.resetTxt}>Clear & Reset Form</Text>
          </TouchableOpacity>
        )}

        <View style={s.disclaimer}>
          <Text style={s.disclaimerTxt}>
            ⚕ For clinical decision support only. This is not a medical diagnosis.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.background },
  content:      { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  resultCard:   { borderRadius: RADIUS.xl, borderWidth: 1.5, padding: SPACING.lg, alignItems: 'center', gap: 6 },
  resultRed:    { backgroundColor: COLORS.dangerLight,  borderColor: COLORS.danger },
  resultGreen:  { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
  resultEmoji:  { fontSize: 52 },
  resultLabel:  { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  resultSub:    { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  cardTitle:    { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  cardSub:      { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  field:        { marginTop: SPACING.md },
  fieldTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  fieldLabel:   { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  unitPill:     { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  unitTxt:      { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  fieldHint:    { fontSize: 12, color: COLORS.textMuted, marginBottom: 6 },
  input:        { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 12, fontSize: 15, color: COLORS.textPrimary },
  resetRow:     { alignItems: 'center', paddingVertical: SPACING.xs },
  resetTxt:     { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  disclaimer:   { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.md },
  disclaimerTxt:{ fontSize: 12, color: COLORS.primary, lineHeight: 18, fontWeight: '500' },
});

export default DiabetesPredictionScreen;