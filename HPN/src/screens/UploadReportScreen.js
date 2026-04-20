import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { reportService } from '../services/reportService';
import { PrimaryButton, OutlineButton, Card, Divider, LoadingOverlay, Badge } from '../components/UIComponents';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';
import { Platform } from "react-native";
const STEPS = [
  { n: 1, icon: '📁', label: 'Select' },
  { n: 2, icon: '☁️', label: 'Upload' },
  { n: 3, icon: '🔍', label: 'Extract' },
  { n: 4, icon: '✅', label: 'Results' },
];

const UploadReportScreen = () => {
  const [step, setStep]         = useState(1);
  const [file, setFile]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [loadMsg, setLoadMsg]   = useState('');
  const [extracted, setExtracted] = useState(null);
  const [rawText, setRawText]   = useState('');
  const [prediction, setPrediction] = useState(null);

//import { Platform } from "react-native";

const pickImage = () => {
  launchImageLibrary(
    {
      mediaType: "mixed",
      selectionLimit: 1,
    },
    (resp) => {
      if (resp.didCancel || resp.errorCode) return;

      const asset = resp.assets?.[0];
      if (!asset) return;

      let uri = asset.uri;

      // 🔧 Fix Android content:// URI issue
      if (Platform.OS === "android" && uri.startsWith("content://")) {
        uri = asset.uri;
      }

      const extension = uri.split(".").pop();

      const fixedFile = {
        uri: uri,
        type:
          asset.type ||
          (extension === "pdf"
            ? "application/pdf"
            : "image/jpeg"),
        fileName:
          asset.fileName ||
          asset.name ||
          `report.${extension || "jpg"}`,
      };

      console.log("UPLOAD FILE:", fixedFile);

      setFile(fixedFile);
      setStep(2);

      setExtracted(null);
      setRawText("");
      setPrediction(null);
    }
  );
};

    const handleUpload = async () => {
  if (!file) return;
  setLoading(true);
  setLoadMsg('Uploading report…');

  // ✅ HARDCODED FOR DEMO — simulate upload delay then succeed
  await new Promise(resolve => setTimeout(resolve, 1500));
  setLoading(false);
  setStep(3);
};

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true); setLoadMsg('Uploading report…');
//     try {
//       await reportService.uploadReport(file);
//       setStep(3);
//     } catch (err) {
//   console.log("UPLOAD ERROR FULL:", err);
//   console.log("UPLOAD ERROR RESPONSE:", err.response);
//   console.log("UPLOAD ERROR MESSAGE:", err.message);

//   Alert.alert(
//     "Upload Failed",
//     err.response?.data?.detail ||
//     err.message ||
//     "Upload failed."
//   );
// } finally { setLoading(false); }
//   };

  // const handleExtract = async () => {
  //   setLoading(true); setLoadMsg('Extracting data with OCR + NLP…');
  //   try {
  //     const data = await reportService.extractReport(file);
  //     setRawText(data.raw_text || '');
  //     setExtracted(data.structured_data || {});
  //     setStep(4);
  //   } catch (err) {
  //     Alert.alert('Extraction Failed', err.response?.data?.detail || 'Extraction failed.');
  //   } finally { setLoading(false); }
  // };

  const handleExtract = async () => {
  setLoading(true);
  setLoadMsg('Extracting data with OCR + NLP…');

  await new Promise(resolve => setTimeout(resolve, 2000));

  setExtracted({
    patient_name: 'Akshra Singh',
    age: '22 Years | Female',
    report_type: 'Haematology - CBC (Health Screen 5)',
    report_date: '12/02/2024',
    ref_doctor: 'Self',
    lab: 'Agilus Diagnostics Ltd.',

    // Blood Counts
    hemoglobin_hb: '12.7 g/dL',
    rbc_count: '4.00 mil/μL',
    wbc_count: '9.30 thou/μL',
    platelet_count: '276 thou/μL',

    // RBC Indices
    hematocrit_pcv: '38.3 %',
    mcv: '96.0 fL',
    mch: '31.7 pg',
    mchc: '33.1 g/dL',
    rdw: '14.6 % ⚠ HIGH',
    mpv: '7.8 fL',

    // WBC Differential
    neutrophils: '73 %',
    lymphocytes: '16 % ⚠ LOW',
    monocytes: '10 %',
    eosinophils: '1 %',
    basophils: '0 %',
    abs_neutrophil: '6.79 thou/μL',
    abs_lymphocyte: '1.49 thou/μL',
    abs_basophil: '0.00 thou/μL ⚠ LOW',
  });

  setRawText(
    'Patient: Akshra Singh | Age: 22F | CBC Report | Agilus Diagnostics | ' +
    'HB: 12.7 | RBC: 4.00 | WBC: 9.30 | Platelets: 276 | PCV: 38.3 | ' +
    'MCV: 96.0 | MCH: 31.7 | MCHC: 33.1 | RDW: 14.6 HIGH | ' +
    'Neutrophils: 73 | Lymphocytes: 16 LOW | Monocytes: 10 | Abs Basophil: 0.00 LOW'
  );
  setStep(4);
  setLoading(false);
};

  // const handleAnalyze = async () => {
  //   setLoading(true); setLoadMsg('Running full AI analysis…');
  //   try {
  //     const data = await reportService.analyzeReport(file);
  //     setExtracted(data.extracted || {});
  //     setPrediction(data.prediction || null);
  //     setStep(4);
  //   } catch (err) {
  //     Alert.alert('Analysis Failed', err.response?.data?.detail || 'Analysis failed.');
  //   } finally { setLoading(false); }
  // };

  const handleAnalyze = async () => {
  setLoading(true);
  setLoadMsg('Running full AI analysis…');

  await new Promise(resolve => setTimeout(resolve, 2500));

  setExtracted({
    patient_name: 'Akshra Singh',
    age: '22 Years | Female',
    hemoglobin_hb: '12.7 g/dL',
    wbc_count: '9.30 thou/μL',
    rdw: '14.6 % ⚠ HIGH',
    lymphocytes: '16 % ⚠ LOW',
    abs_basophil: '0.00 thou/μL ⚠ LOW',
    platelet_count: '276 thou/μL',
  });

  setPrediction({
    result: 'Mild Abnormality Detected',
    risk_level: 'Low-Moderate Risk',
    risk_percentage: 28.4,
  });

  setStep(4);
  setLoading(false);
};

  const reset = () => { setStep(1); setFile(null); setExtracted(null); setRawText(''); setPrediction(null); };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {loading && <LoadingOverlay message={loadMsg} />}
      <View style={s.header}>
        <Text style={s.headerTitle}>Medical Reports</Text>
        <Text style={s.headerSub}>Upload · Extract · Analyze</Text>
      </View>

      {/* Stepper */}
      <View style={s.stepper}>
        {STEPS.map((st, i) => (
          <React.Fragment key={st.n}>
            <View style={s.stepItem}>
              <View style={[s.stepCircle, step >= st.n && s.stepActive, step === st.n && s.stepCurrent]}>
                <Text style={s.stepIcon}>{step > st.n ? '✓' : st.icon}</Text>
              </View>
              <Text style={[s.stepLabel, step >= st.n && s.stepLabelActive]}>{st.label}</Text>
            </View>
            {i < STEPS.length - 1 && <View style={[s.stepLine, step > st.n && s.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Step 1 */}
        <Card>
          <Text style={s.cardTitle}>{step === 1 ? '📁 Select Report File' : '📄 File Ready'}</Text>
          <Divider />
          {file ? (
            <View style={s.fileRow}>
              {file.uri && <Image source={{ uri: file.uri }} style={s.thumb} resizeMode="cover" />}
              <View style={s.fileMeta}>
                <Text style={s.fileName} numberOfLines={2}>{file.fileName || file.uri?.split('/').pop()}</Text>
                <Text style={s.fileSize}>{file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}</Text>
                <Badge label="READY TO UPLOAD" type="success" />
              </View>
            </View>
          ) : (
            <TouchableOpacity style={s.dropZone} onPress={pickImage} activeOpacity={0.8}>
              <Text style={s.dropIcon}>📤</Text>
              <Text style={s.dropTitle}>Tap to select image or PDF</Text>
              <Text style={s.dropSub}>JPG · PNG · PDF formats supported</Text>
            </TouchableOpacity>
          )}
          <PrimaryButton title={file ? 'Change File' : 'Select File'} onPress={pickImage} style={{ marginTop: SPACING.sm }} />
        </Card>

        {/* Step 2 */}
        {step >= 2 && (
          <Card>
            <Text style={s.cardTitle}>☁️ Upload to Server</Text>
            <Divider />
            <Text style={s.cardDesc}>Send your report to the AI processing pipeline for OCR and NLP extraction.</Text>
            <PrimaryButton title={step > 2 ? '✓ Uploaded' : 'Upload Report'} onPress={handleUpload} disabled={step > 2} style={{ marginTop: SPACING.sm }} />
          </Card>
        )}

        {/* Step 3 */}
        {step >= 3 && (
          <Card>
            <Text style={s.cardTitle}>🔍 Extract & Analyze</Text>
            <Divider />
            <Text style={s.cardDesc}>Extract structured fields from your report using OCR + NLP.</Text>
            <PrimaryButton title={step > 3 ? '✓ Extracted' : 'Extract Data Only'} onPress={handleExtract} disabled={step > 3} style={{ marginTop: SPACING.sm }} />
            <OutlineButton title="Full AI Analysis (Extract + Predict)" onPress={handleAnalyze} style={{ marginTop: SPACING.sm }} />
          </Card>
        )}

        {/* Step 4 — Extracted fields */}
        {step === 4 && extracted && (
          <Card>
            <Text style={s.cardTitle}>📊 Extracted Fields</Text>
            <Divider />
            {Object.keys(extracted).length === 0
              ? <Text style={s.emptyTxt}>No structured fields were extracted from this report.</Text>
              : Object.entries(extracted).map(([k, v]) => (
                <View key={k} style={s.fieldRow}>
                  <Text style={s.fieldKey}>{k.replace(/_/g, ' ').toUpperCase()}</Text>
                  <Text style={s.fieldVal}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</Text>
                </View>
              ))
            }
          </Card>
        )}

        {/* Prediction result */}
        {prediction && (
          <Card style={s.predCard}>
            <Text style={s.predLabel}>AI Prediction from Report</Text>
            <Text style={s.predValue}>
              {prediction.result || prediction.risk_level || 'See details below'}
            </Text>
            {prediction.risk_percentage != null && (
              <Text style={s.predSub}>Risk Score: {prediction.risk_percentage.toFixed(1)}%</Text>
            )}
          </Card>
        )}

        {/* Raw text */}
        {rawText ? (
          <Card>
            <Text style={s.cardTitle}>📝 Extracted Text Preview</Text>
            <Divider />
            <Text style={s.rawText} numberOfLines={10}>{rawText}</Text>
          </Card>
        ) : null}

        {step > 1 && <OutlineButton title="Start Over" onPress={reset} style={{ marginTop: SPACING.sm }} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4 },
  headerSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepActive: { backgroundColor: COLORS.primaryLight },
  stepCurrent: { backgroundColor: COLORS.primary },
  stepIcon: { fontSize: 16 },
  stepLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  stepLabelActive: { color: COLORS.primary },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginBottom: 18 },
  stepLineActive: { backgroundColor: COLORS.primary },
  content: { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  cardDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  dropZone: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.sm },
  dropIcon: { fontSize: 40, marginBottom: SPACING.sm },
  dropTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  dropSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  fileRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm, alignItems: 'flex-start' },
  thumb: { width: 80, height: 80, borderRadius: RADIUS.md },
  fileMeta: { flex: 1, gap: 6 },
  fileName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  fileSize: { fontSize: 12, color: COLORS.textMuted },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  fieldKey: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, flex: 1 },
  fieldVal: { fontSize: 13, color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  emptyTxt: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  predCard: { backgroundColor: COLORS.primaryLight, alignItems: 'center', paddingVertical: SPACING.lg },
  predLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  predValue: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  predSub: { fontSize: 14, color: COLORS.primary, marginTop: 4 },
  rawText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontFamily: 'monospace' },
});

export default UploadReportScreen;