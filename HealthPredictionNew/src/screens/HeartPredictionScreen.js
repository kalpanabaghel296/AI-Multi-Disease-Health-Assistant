import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { PrimaryButton, Card, Divider, LoadingOverlay } from '../components/UIComponents';
import { predictionService } from '../services/predictionService';
import { COLORS, SPACING, RADIUS } from '../../config';

// Numeric fields
const NUM_FIELDS = [
  { key: 'age',      label: 'Age',                   hint: 'Patient age in years',               unit: 'years', placeholder: 'e.g. 52' },
  { key: 'trestbps', label: 'Resting Blood Pressure', hint: 'Resting BP on hospital admission',   unit: 'mm Hg', placeholder: 'e.g. 130' },
  { key: 'chol',     label: 'Serum Cholesterol',      hint: 'Total cholesterol level',             unit: 'mg/dL', placeholder: 'e.g. 230' },
  { key: 'thalach',  label: 'Max Heart Rate',          hint: 'Maximum heart rate achieved',         unit: 'bpm',   placeholder: 'e.g. 150' },
  { key: 'oldpeak',  label: 'ST Depression',           hint: 'Exercise-induced ST depression',      unit: 'mm',    placeholder: 'e.g. 1.0' },
];

// Toggle (binary) fields — 0 or 1
const TOGGLE_FIELDS = [
  { key: 'sex',   label: 'Sex',                    opts: ['Female (0)', 'Male (1)'] },
  { key: 'fbs',   label: 'Fasting Blood Sugar >120', opts: ['No (0)', 'Yes (1)'] },
  { key: 'exang', label: 'Exercise-Induced Angina',  opts: ['No (0)', 'Yes (1)'] },
];

// Segmented (multi-option) fields
const SEG_FIELDS = [
  {
    key: 'cp', label: 'Chest Pain Type',
    opts: ['Typical Angina', 'Atypical', 'Non-anginal', 'Asymptomatic'],
    hint: '0 → 3',
  },
  {
    key: 'restecg', label: 'Resting ECG Results',
    opts: ['Normal', 'ST-T Wave Abnormality', 'LV Hypertrophy'],
    hint: '0 → 2',
  },
  {
    key: 'slope', label: 'ST Slope (Peak Exercise)',
    opts: ['Upsloping', 'Flat', 'Downsloping'],
    hint: '0 → 2',
  },
  {
    key: 'ca', label: 'Major Vessels (Fluoroscopy)',
    opts: ['0', '1', '2', '3'],
    hint: 'coloured by fluoroscopy',
  },
  {
    key: 'thal', label: 'Thalassemia',
    opts: ['Normal', 'Fixed Defect', 'Reversible Defect', 'Other'],
    hint: '0 → 3',
  },
];

const INITIAL = {
  age: '', trestbps: '', chol: '', thalach: '', oldpeak: '',
  sex: null, fbs: null, exang: null,
  cp: null, restecg: null, slope: null, ca: null, thal: null,
};

const HeartPredictionScreen = ({ navigation }) => {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  const update = (key, val) => { setForm(p => ({ ...p, [key]: val })); setResult(null); };

  const validate = () => {
    for (const f of NUM_FIELDS) {
      if (form[f.key] === '') return `Please enter ${f.label}.`;
      if (isNaN(Number(form[f.key]))) return `${f.label} must be a valid number.`;
    }
    for (const f of [...TOGGLE_FIELDS, ...SEG_FIELDS]) {
      if (form[f.key] === null) return `Please select a value for ${f.label}.`;
    }
    return null;
  };

  const handlePredict = async () => {
    const err = validate();
    if (err) return Alert.alert('Incomplete Form', err);
    setLoading(true);
    try {
      const payload = {
        age:      parseFloat(form.age),
        sex:      form.sex,
        cp:       form.cp,
        trestbps: parseFloat(form.trestbps),
        chol:     parseFloat(form.chol),
        fbs:      form.fbs,
        restecg:  form.restecg,
        thalach:  parseFloat(form.thalach),
        exang:    form.exang,
        oldpeak:  parseFloat(form.oldpeak),
        slope:    form.slope,
        ca:       form.ca,
        thal:     form.thal,
      };
      const data = await predictionService.heart(payload);
      setResult(data);
    } catch (e) {
      Alert.alert('Prediction Failed', e.response?.data?.detail || 'Could not connect to the server.');
    } finally { setLoading(false); }
  };

  const reset = () => { setForm(INITIAL); setResult(null); };
  const isDisease = result?.prediction === 1;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {loading && <LoadingOverlay message="Running heart disease model…" />}
      <ScreenHeader title="Heart Disease" subtitle="13 clinical parameters · Ensemble Model" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {result && (
          <View style={[s.resultCard, isDisease ? s.resultRed : s.resultGreen]}>
            <Text style={s.resultEmoji}>{isDisease ? '⚠️' : '✅'}</Text>
            <Text style={[s.resultLabel, { color: isDisease ? COLORS.danger : COLORS.success }]}>{result.result}</Text>
            <Text style={[s.resultSub, { color: isDisease ? COLORS.danger : COLORS.success }]}>
              {isDisease ? 'Cardiovascular risk indicators detected. Consult a cardiologist.' : 'No significant heart disease risk detected.'}
            </Text>
          </View>
        )}

        {/* Numeric inputs */}
        <Card>
          <Text style={s.cardTitle}>Clinical Measurements</Text>
          <Divider />
          {NUM_FIELDS.map(f => (
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

        {/* Binary toggles */}
        <Card>
          <Text style={s.cardTitle}>Binary Parameters</Text>
          <Divider />
          {TOGGLE_FIELDS.map(f => (
            <View key={f.key} style={s.field}>
              <Text style={s.fieldLabel}>{f.label}</Text>
              <View style={s.toggleRow}>
                {f.opts.map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[s.toggleBtn, form[f.key] === idx && s.toggleActive]}
                    onPress={() => update(f.key, idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.toggleTxt, form[f.key] === idx && s.toggleTxtActive]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </Card>

        {/* Segmented selectors */}
        <Card>
          <Text style={s.cardTitle}>Categorical Parameters</Text>
          <Divider />
          {SEG_FIELDS.map(f => (
            <View key={f.key} style={s.field}>
              <View style={s.fieldTop}>
                <Text style={s.fieldLabel}>{f.label}</Text>
                <Text style={s.fieldHintInline}>{f.hint}</Text>
              </View>
              <View style={s.segRow}>
                {f.opts.map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[s.segBtn, form[f.key] === idx && s.segActive]}
                    onPress={() => update(f.key, idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.segIdx, form[f.key] === idx && s.segIdxActive]}>{idx}</Text>
                    <Text style={[s.segTxt, form[f.key] === idx && s.segTxtActive]} numberOfLines={2}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </Card>

        <PrimaryButton title="❤️  Run Heart Disease Prediction" onPress={handlePredict} />
        {result && <TouchableOpacity style={s.resetRow} onPress={reset}><Text style={s.resetTxt}>Clear & Reset Form</Text></TouchableOpacity>}
        <View style={s.disclaimer}><Text style={s.disclaimerTxt}>⚕ For clinical decision support only. Not a medical diagnosis.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: COLORS.background },
  content:         { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  resultCard:      { borderRadius: RADIUS.xl, borderWidth: 1.5, padding: SPACING.lg, alignItems: 'center', gap: 6 },
  resultRed:       { backgroundColor: COLORS.dangerLight,  borderColor: COLORS.danger },
  resultGreen:     { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
  resultEmoji:     { fontSize: 52 },
  resultLabel:     { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  resultSub:       { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  cardTitle:       { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  field:           { marginTop: SPACING.md },
  fieldTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  fieldLabel:      { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  fieldHint:       { fontSize: 12, color: COLORS.textMuted, marginBottom: 6 },
  fieldHintInline: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' },
  unitPill:        { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  unitTxt:         { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  input:           { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 12, fontSize: 15, color: COLORS.textPrimary },
  toggleRow:       { flexDirection: 'row', gap: SPACING.sm, marginTop: 6 },
  toggleBtn:       { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.background },
  toggleActive:    { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleTxt:       { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  toggleTxtActive: { color: COLORS.white },
  segRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: 6 },
  segBtn:          { paddingVertical: 8, paddingHorizontal: 10, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', minWidth: 70, backgroundColor: COLORS.background },
  segActive:       { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  segIdx:          { fontSize: 16, fontWeight: '800', color: COLORS.textMuted },
  segIdxActive:    { color: COLORS.white },
  segTxt:          { fontSize: 10, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
  segTxtActive:    { color: 'rgba(255,255,255,0.85)' },
  resetRow:        { alignItems: 'center', paddingVertical: SPACING.xs },
  resetTxt:        { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  disclaimer:      { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.md },
  disclaimerTxt:   { fontSize: 12, color: COLORS.primary, lineHeight: 18, fontWeight: '500' },
});

export default HeartPredictionScreen;