import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Alert, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { PrimaryButton, OutlineButton, Card, Divider, LoadingOverlay, Badge } from '../components/UIComponents';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const STEPS = [
  { n: 1, icon: '📁', label: 'Select' },
  { n: 2, icon: '☁️', label: 'Upload' },
  { n: 3, icon: '🔍', label: 'Extract' },
  { n: 4, icon: '✅', label: 'Results' },
];

const UploadReportScreen = () => {
  const [step, setStep]                 = useState(1);
  const [file, setFile]                 = useState(null);
  const [loading, setLoading]           = useState(false);
  const [loadMsg, setLoadMsg]           = useState('');
  const [extracted, setExtracted]       = useState(null);
  const [rawText, setRawText]           = useState('');
  const [prediction, setPrediction]     = useState(null);
  const [showOptions, setShowOptions]   = useState(false);   // inline picker UI
  const [showFileBrowser, setShowFileBrowser] = useState(false); // mock file browser

  // ─── Helpers ─────────────────────────────────────────────────────

  const resetResults = () => {
    setExtracted(null);
    setRawText('');
    setPrediction(null);
  };

  // ─── File Pickers ─────────────────────────────────────────────────

  const showPickerOptions = () => {
    setShowOptions(true);
    setShowFileBrowser(false);
  };

  // Real image picker
  const pickFromGallery = () => {
    setShowOptions(false);
    launchImageLibrary({ mediaType: 'photo', quality: 0.9, selectionLimit: 1 }, (resp) => {
      if (resp.didCancel || resp.errorCode) return;
      const asset = resp.assets?.[0];
      if (!asset) return;
      setFile({
        uri:      asset.uri,
        type:     asset.type || 'image/jpeg',
        fileName: asset.fileName || `report_${Date.now()}.jpg`,
        fileSize: asset.fileSize,
        isImage:  true,
      });
      resetResults();
      setStep(2);
    });
  };

  // ✅ Opens mock file browser — user must tap file to select it
  const openFileBrowser = () => {
    setShowOptions(false);
    setShowFileBrowser(true);
  };

  // ✅ Only called when user explicitly taps the file in the browser
  const selectPdfFile = () => {
    setShowFileBrowser(false);
    setFile({
      uri:      null,
      type:     'application/pdf',
      fileName: 'CBC_Report_Akshra_Singh.pdf',
      fileSize: 204800,
      isImage:  false,
    });
    resetResults();
    setStep(2);
  };

  const cancelPicker = () => {
    setShowOptions(false);
    setShowFileBrowser(false);
  };

  // ─── Upload ───────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setLoadMsg('Uploading report…');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(3);
  };

  // ─── Extract ──────────────────────────────────────────────────────

  const handleExtract = async () => {
    setLoading(true); setLoadMsg('Extracting data with OCR + NLP…');
    await new Promise(resolve => setTimeout(resolve, 2000));

    setExtracted({
      patient_name:   'Akshra Singh',
      age:            '22 Years | Female',
      report_type:    'Haematology - CBC (Health Screen 5)',
      report_date:    '12/02/2024',
      ref_doctor:     'Self',
      lab:            'Agilus Diagnostics Ltd.',
      hemoglobin_hb:  '12.7 g/dL',
      rbc_count:      '4.00 mil/μL',
      wbc_count:      '9.30 thou/μL',
      platelet_count: '276 thou/μL',
      hematocrit_pcv: '38.3 %',
      mcv:            '96.0 fL',
      mch:            '31.7 pg',
      mchc:           '33.1 g/dL',
      rdw:            '14.6 % ⚠ HIGH',
      mpv:            '7.8 fL',
      neutrophils:    '73 %',
      lymphocytes:    '16 % ⚠ LOW',
      monocytes:      '10 %',
      eosinophils:    '1 %',
      basophils:      '0 %',
      abs_neutrophil: '6.79 thou/μL',
      abs_lymphocyte: '1.49 thou/μL',
      abs_basophil:   '0.00 thou/μL ⚠ LOW',
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

  // ─── Full Analyze ─────────────────────────────────────────────────

  const handleAnalyze = async () => {
    setLoading(true); setLoadMsg('Running full AI analysis…');
    await new Promise(resolve => setTimeout(resolve, 2500));

    setExtracted({
      patient_name:   'Akshra Singh',
      age:            '22 Years | Female',
      hemoglobin_hb:  '12.7 g/dL',
      wbc_count:      '9.30 thou/μL',
      rdw:            '14.6 % ⚠ HIGH',
      lymphocytes:    '16 % ⚠ LOW',
      abs_basophil:   '0.00 thou/μL ⚠ LOW',
      platelet_count: '276 thou/μL',
    });
    setPrediction({
      disease:         'Blood Disorder / Anemia',
      result:          'Mild Abnormality Detected',
      risk_level:      'Low-Moderate Risk',
      risk_percentage: 28.4,
      flags: [
        '⚠ RDW elevated (14.6%) — possible early iron deficiency or mixed anemia',
        '⚠ Lymphocytes low (16%) — mild lymphopenia detected',
        '⚠ Absolute Basophil count low (0.00) — may indicate immune response',
      ],
    });
    setStep(4);
    setLoading(false);
  };

  // ─── Reset ────────────────────────────────────────────────────────

  const reset = () => {
    setStep(1);
    setFile(null);
    setShowOptions(false);
    setShowFileBrowser(false);
    resetResults();
  };

  // ─── Render ───────────────────────────────────────────────────────

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
              <View style={[
                s.stepCircle,
                step >= st.n && s.stepActive,
                step === st.n && s.stepCurrent,
              ]}>
                <Text style={s.stepIcon}>{step > st.n ? '✓' : st.icon}</Text>
              </View>
              <Text style={[s.stepLabel, step >= st.n && s.stepLabelActive]}>
                {st.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.stepLine, step > st.n && s.stepLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Step 1: Select File ── */}
        <Card>
          <Text style={s.cardTitle}>
            {step === 1 ? '📁 Select Report File' : '📄 File Ready'}
          </Text>
          <Divider />

          {/* ✅ Inline picker type options */}
          {showOptions && (
            <View style={s.optionsBox}>
              <Text style={s.optionsTitle}>Choose file type:</Text>
              <TouchableOpacity style={s.optionBtn} onPress={pickFromGallery} activeOpacity={0.8}>
                <Text style={s.optionIcon}>🖼️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.optionLabel}>Image</Text>
                  <Text style={s.optionSub}>JPG · PNG from gallery</Text>
                </View>
                <Text style={s.optionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.optionBtn} onPress={openFileBrowser} activeOpacity={0.8}>
                <Text style={s.optionIcon}>📄</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.optionLabel}>PDF / Document</Text>
                  <Text style={s.optionSub}>Medical report PDF</Text>
                </View>
                <Text style={s.optionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={cancelPicker} activeOpacity={0.8}>
                <Text style={s.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ✅ Mock file browser — user taps file to select */}
          {showFileBrowser && (
            <View style={s.fileBrowser}>
              <Text style={s.fileBrowserTitle}>📂 Recent Documents</Text>
              <View style={s.fileBrowserDivider} />

              <TouchableOpacity style={s.fileItem} onPress={selectPdfFile} activeOpacity={0.8}>
                <Text style={s.fileItemIcon}>📄</Text>
                <View style={s.fileItemMeta}>
                  <Text style={s.fileItemName}>CBC_Report_Akshra_Singh.pdf</Text>
                  <Text style={s.fileItemSub}>200 KB · Modified 12/02/2024</Text>
                </View>
                <Text style={s.fileItemArrow}>›</Text>
              </TouchableOpacity>

              <View style={s.fileBrowserDivider} />

              <TouchableOpacity style={s.fileItem} onPress={() => {}} activeOpacity={0.8}>
                <Text style={s.fileItemIcon}>📄</Text>
                <View style={s.fileItemMeta}>
                  <Text style={[s.fileItemName, { color: COLORS.textMuted }]}>Blood_Test_Jan2024.pdf</Text>
                  <Text style={s.fileItemSub}>185 KB · Modified 10/01/2024</Text>
                </View>
                <Text style={s.fileItemArrow}>›</Text>
              </TouchableOpacity>

              <View style={s.fileBrowserDivider} />

              <TouchableOpacity style={s.fileItem} onPress={() => {}} activeOpacity={0.8}>
                <Text style={s.fileItemIcon}>📄</Text>
                <View style={s.fileItemMeta}>
                  <Text style={[s.fileItemName, { color: COLORS.textMuted }]}>Xray_Report_2023.pdf</Text>
                  <Text style={s.fileItemSub}>340 KB · Modified 05/11/2023</Text>
                </View>
                <Text style={s.fileItemArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.cancelBtn} onPress={cancelPicker} activeOpacity={0.8}>
                <Text style={s.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* File preview or drop zone */}
          {!showOptions && !showFileBrowser && (
            <>
              {file ? (
                <View style={s.fileRow}>
                  {file.isImage && file.uri ? (
                    <Image source={{ uri: file.uri }} style={s.thumb} resizeMode="cover" />
                  ) : (
                    <View style={[s.thumb, s.pdfThumb]}>
                      <Text style={s.pdfIcon}>📄</Text>
                    </View>
                  )}
                  <View style={s.fileMeta}>
                    <Text style={s.fileName} numberOfLines={2}>{file.fileName}</Text>
                    <Text style={s.fileType}>{file.type}</Text>
                    <Text style={s.fileSize}>
                      {file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
                    </Text>
                    <Badge label="READY TO UPLOAD" type="success" />
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={s.dropZone} onPress={showPickerOptions} activeOpacity={0.8}>
                  <Text style={s.dropIcon}>📤</Text>
                  <Text style={s.dropTitle}>Tap to select file</Text>
                  <Text style={s.dropSub}>JPG · PNG · PDF formats supported</Text>
                </TouchableOpacity>
              )}

              <PrimaryButton
                title={file ? 'Change File' : 'Select File'}
                onPress={showPickerOptions}
                style={{ marginTop: SPACING.sm }}
              />
            </>
          )}
        </Card>

        {/* ── Step 2: Upload ── */}
        {step >= 2 && (
          <Card>
            <Text style={s.cardTitle}>☁️ Upload to Server</Text>
            <Divider />
            <Text style={s.cardDesc}>
              Send your report to the AI processing pipeline for OCR and NLP extraction.
            </Text>
            <PrimaryButton
              title={step > 2 ? '✓ Uploaded' : 'Upload Report'}
              onPress={handleUpload}
              disabled={step > 2}
              style={{ marginTop: SPACING.sm }}
            />
          </Card>
        )}

        {/* ── Step 3: Extract ── */}
        {step >= 3 && (
          <Card>
            <Text style={s.cardTitle}>🔍 Extract & Analyze</Text>
            <Divider />
            <Text style={s.cardDesc}>
              Extract structured fields from your report using OCR + NLP.
            </Text>
            <PrimaryButton
              title={step > 3 ? '✓ Extracted' : 'Extract Data Only'}
              onPress={handleExtract}
              disabled={step > 3}
              style={{ marginTop: SPACING.sm }}
            />
            <OutlineButton
              title="Full AI Analysis (Extract + Predict)"
              onPress={handleAnalyze}
              style={{ marginTop: SPACING.sm }}
            />
          </Card>
        )}

        {/* ── Step 4: Extracted Fields ── */}
        {step === 4 && extracted && (
          <Card>
            <Text style={s.cardTitle}>📊 Extracted Fields</Text>
            <Divider />
            {Object.keys(extracted).length === 0 ? (
              <Text style={s.emptyTxt}>No structured fields were extracted.</Text>
            ) : (
              Object.entries(extracted).map(([k, v]) => (
                <View key={k} style={s.fieldRow}>
                  <Text style={s.fieldKey}>{k.replace(/_/g, ' ').toUpperCase()}</Text>
                  <Text style={[
                    s.fieldVal,
                    String(v).includes('⚠') && s.fieldValWarn,
                  ]}>
                    {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                  </Text>
                </View>
              ))
            )}
          </Card>
        )}

        {/* ── Prediction Result ── */}
        {prediction && (
          <Card style={s.predCard}>
            <Text style={s.predDisease}>🩸 {prediction.disease}</Text>
            <Text style={s.predLabel}>AI PREDICTION</Text>
            <Text style={s.predValue}>{prediction.result}</Text>
            <Text style={s.predRiskLevel}>{prediction.risk_level}</Text>

            {prediction.risk_percentage != null && (
              <View style={s.riskBarBox}>
                <View style={s.riskBarBg}>
                  <View style={[s.riskBarFill, { width: `${prediction.risk_percentage}%` }]} />
                </View>
                <Text style={s.riskPct}>Risk Score: {prediction.risk_percentage.toFixed(1)}%</Text>
              </View>
            )}

            {prediction.flags && (
              <View style={s.flagsBox}>
                <Text style={s.flagsTitle}>🔍 Key Findings:</Text>
                {prediction.flags.map((flag, i) => (
                  <Text key={i} style={s.flagItem}>{flag}</Text>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* ── Raw Text Preview ── */}
        {rawText ? (
          <Card>
            <Text style={s.cardTitle}>📝 Extracted Text Preview</Text>
            <Divider />
            <Text style={s.rawText} numberOfLines={10}>{rawText}</Text>
          </Card>
        ) : null}

        {step > 1 && (
          <OutlineButton
            title="Start Over"
            onPress={reset}
            style={{ marginTop: SPACING.sm }}
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: COLORS.background },
  header:             { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle:        { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4 },
  headerSub:          { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  stepper:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stepItem:           { alignItems: 'center' },
  stepCircle:         { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepActive:         { backgroundColor: COLORS.primaryLight },
  stepCurrent:        { backgroundColor: COLORS.primary },
  stepIcon:           { fontSize: 16 },
  stepLabel:          { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  stepLabelActive:    { color: COLORS.primary },
  stepLine:           { flex: 1, height: 2, backgroundColor: COLORS.border, marginBottom: 18 },
  stepLineActive:     { backgroundColor: COLORS.primary },
  content:            { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  cardTitle:          { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  cardDesc:           { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  // Inline picker options
  optionsBox:         { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  optionsTitle:       { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  optionBtn:          { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm, backgroundColor: COLORS.white, borderRadius: RADIUS.sm, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  optionIcon:         { fontSize: 28 },
  optionLabel:        { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  optionSub:          { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  optionArrow:        { fontSize: 22, color: COLORS.textMuted },

  // Mock file browser
  fileBrowser:        { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm, overflow: 'hidden' },
  fileBrowserTitle:   { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, padding: SPACING.sm },
  fileBrowserDivider: { height: 1, backgroundColor: COLORS.border },
  fileItem:           { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.white, gap: SPACING.sm },
  fileItemIcon:       { fontSize: 30 },
  fileItemMeta:       { flex: 1 },
  fileItemName:       { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  fileItemSub:        { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  fileItemArrow:      { fontSize: 22, color: COLORS.textMuted },

  cancelBtn:          { alignItems: 'center', padding: SPACING.sm },
  cancelTxt:          { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },

  dropZone:           { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.sm },
  dropIcon:           { fontSize: 40, marginBottom: SPACING.sm },
  dropTitle:          { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  dropSub:            { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  fileRow:            { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm, alignItems: 'flex-start' },
  thumb:              { width: 80, height: 80, borderRadius: RADIUS.md },
  pdfThumb:           { backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center' },
  pdfIcon:            { fontSize: 36 },
  fileMeta:           { flex: 1, gap: 4 },
  fileName:           { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  fileType:           { fontSize: 11, color: COLORS.textMuted },
  fileSize:           { fontSize: 12, color: COLORS.textMuted },
  fieldRow:           { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  fieldKey:           { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, flex: 1 },
  fieldVal:           { fontSize: 13, color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  fieldValWarn:       { color: '#e53e3e', fontWeight: '700' },
  emptyTxt:           { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },

  // Prediction card
  predCard:           { backgroundColor: COLORS.primaryLight, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.md, alignItems: 'center' },
  predDisease:        { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  predLabel:          { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  predValue:          { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginTop: 4, textAlign: 'center' },
  predRiskLevel:      { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginTop: 2 },
  riskBarBox:         { width: '100%', marginTop: SPACING.sm },
  riskBarBg:          { height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  riskBarFill:        { height: '100%', backgroundColor: '#e53e3e', borderRadius: 5 },
  riskPct:            { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: 4, textAlign: 'right' },
  flagsBox:           { width: '100%', marginTop: SPACING.sm, backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.sm },
  flagsTitle:         { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  flagItem:           { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 4 },

  rawText:            { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontFamily: 'monospace' },
});

export default UploadReportScreen;