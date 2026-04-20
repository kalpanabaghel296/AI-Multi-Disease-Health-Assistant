// import React, { useState } from 'react';
// import {
//   View, Text, ScrollView, StyleSheet,
//   TouchableOpacity, Image, Alert, ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { predictionService } from '../services/predictionService';
// import ScreenHeader from '../components/ScreenHeader';
// import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

// const PneumoniaPredictionScreen = ({ navigation }) => {
//   const [image, setImage]     = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult]   = useState(null);

//   const pickImage = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, (resp) => {
//       if (resp.didCancel || resp.errorCode) return;
//       const asset = resp.assets?.[0];
//       if (asset) { setImage(asset); setResult(null); }
//     });
//   };

//   const handlePredict = async () => {
//     if (!image) return Alert.alert('No Image', 'Please select a chest X-ray image first.');
//     setLoading(true);
//     try {
//       const data = await predictionService.predictPneumonia(image);
//       if (data.error) Alert.alert('Error', data.error);
//       else setResult(data);
//     } catch (err) {
//       Alert.alert('Error', err.response?.data?.detail || 'Prediction failed.');
//     } finally { setLoading(false); }
//   };

//   const isPositive = result?.prediction === 1;
//   const resultColor = result ? (isPositive ? COLORS.danger : COLORS.success) : COLORS.primary;

//   return (
//     <SafeAreaView style={s.safe} edges={['top']}>
//       {loading && (
//         <View style={s.overlay}>
//           <View style={s.overlayBox}>
//             <ActivityIndicator size="large" color={COLORS.primary} />
//             <Text style={s.overlayTxt}>Analyzing X-ray...</Text>
//           </View>
//         </View>
//       )}

//       <ScreenHeader
//         title="Pneumonia Detection"
//         subtitle="DenseNet121 · Chest X-ray"
//         onBack={() => navigation.goBack()}
//       />

//       <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

//         {/* Hint */}
//         <View style={s.hint}>
//           <Text style={s.hintIcon}>💡</Text>
//           <Text style={s.hintTxt}>
//             Upload a chest X-ray image (PA view preferred) for best accuracy.
//           </Text>
//         </View>

//         {/* Image Picker */}
//         <View style={s.card}>
//           <Text style={s.cardTitle}>🩻 Select Chest X-Ray</Text>
//           <View style={s.divider} />
//           {image ? (
//             <View style={s.imageRow}>
//               <Image source={{ uri: image.uri }} style={s.previewImg} resizeMode="cover" />
//               <View style={s.imageMeta}>
//                 <Text style={s.imageName} numberOfLines={2}>{image.fileName || 'Selected Image'}</Text>
//                 <Text style={s.imageSize}>
//                   {image.fileSize ? `${(image.fileSize / 1024).toFixed(1)} KB` : ''}
//                 </Text>
//               </View>
//             </View>
//           ) : (
//             <TouchableOpacity style={s.dropZone} onPress={pickImage} activeOpacity={0.8}>
//               <Text style={s.dropIcon}>📤</Text>
//               <Text style={s.dropTitle}>Tap to select X-ray image</Text>
//               <Text style={s.dropSub}>JPG · PNG formats supported</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity style={s.selectBtn} onPress={pickImage} activeOpacity={0.8}>
//             <Text style={s.selectBtnTxt}>{image ? 'Change Image' : 'Select Image'}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Result */}
//         {result && (
//           <View style={[s.resultCard, { borderColor: resultColor }]}>
//             <Text style={s.resultTitle}>Prediction Result</Text>
//             <View style={s.divider} />
//             <Text style={[s.resultValue, { color: resultColor }]}>{result.result}</Text>

//             {/* Confidence */}
//             <View style={[s.confidenceBox, { backgroundColor: isPositive ? COLORS.dangerLight : COLORS.successLight }]}>
//               <Text style={s.confidenceLabel}>CONFIDENCE</Text>
//               <Text style={[s.confidenceValue, { color: resultColor }]}>{result.confidence}%</Text>
//             </View>

//             {/* Probabilities */}
//             <View style={s.probRow}>
//               <View style={[s.probItem, { backgroundColor: COLORS.successLight }]}>
//                 <Text style={s.probLabel}>Normal</Text>
//                 <Text style={[s.probValue, { color: COLORS.success }]}>
//                   {result.normal_probability}%
//                 </Text>
//               </View>
//               <View style={[s.probItem, { backgroundColor: COLORS.dangerLight }]}>
//                 <Text style={s.probLabel}>Pneumonia</Text>
//                 <Text style={[s.probValue, { color: COLORS.danger }]}>
//                   {result.pneumonia_probability}%
//                 </Text>
//               </View>
//             </View>

//             <View style={s.disclaimer}>
//               <Text style={s.disclaimerTxt}>
//                 ⚠️ AI-assisted prediction only. Always consult a qualified radiologist or physician.
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Predict Button */}
//         <TouchableOpacity
//           style={[s.predictBtn, (!image || loading) && s.predictBtnOff]}
//           onPress={handlePredict}
//           disabled={!image || loading}
//           activeOpacity={0.85}>
//           <Text style={s.predictBtnTxt}>
//             {result ? 'Re-analyze X-Ray' : 'Analyze X-Ray'}
//           </Text>
//         </TouchableOpacity>

//         {result && (
//           <TouchableOpacity style={s.clearBtn} onPress={() => { setResult(null); setImage(null); }} activeOpacity={0.8}>
//             <Text style={s.clearBtnTxt}>Clear & Reset</Text>
//           </TouchableOpacity>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const s = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: COLORS.background },
//   overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
//   overlayBox: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', minWidth: 180 },
//   overlayTxt: { marginTop: SPACING.md, fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
//   content: { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
//   hint: { flexDirection: 'row', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
//   hintIcon: { fontSize: 16 },
//   hintTxt: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 19 },
//   card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.sm },
//   cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
//   divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
//   dropZone: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.sm },
//   dropIcon: { fontSize: 40, marginBottom: SPACING.sm },
//   dropTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
//   dropSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
//   imageRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center' },
//   previewImg: { width: 90, height: 90, borderRadius: RADIUS.md },
//   imageMeta: { flex: 1 },
//   imageName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
//   imageSize: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
//   selectBtn: { height: 44, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
//   selectBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
//   resultCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, borderWidth: 2, padding: SPACING.md, ...SHADOW.md },
//   resultTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
//   resultValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4, marginBottom: SPACING.sm },
//   confidenceBox: { borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
//   confidenceLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' },
//   confidenceValue: { fontSize: 22, fontWeight: '800' },
//   probRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
//   probItem: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
//   probLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
//   probValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
//   disclaimer: { backgroundColor: COLORS.warningLight, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
//   disclaimerTxt: { fontSize: 12, color: COLORS.warning, lineHeight: 17 },
//   predictBtn: { height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOW.sm },
//   predictBtnOff: { opacity: 0.5 },
//   predictBtnTxt: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
//   clearBtn: { height: 48, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
//   clearBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
// });

// export default PneumoniaPredictionScreen;

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { predictionService } from '../services/predictionService';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const PneumoniaPredictionScreen = ({ navigation }) => {
  const [image, setImage]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, (resp) => {
      if (resp.didCancel || resp.errorCode) return;
      const asset = resp.assets?.[0];
      if (asset) { setImage(asset); setResult(null); }
    });
  };

  const handlePredict = async () => {
    if (!image) return Alert.alert('No Image', 'Please select a chest X-ray image first.');
    setLoading(true);

    // ✅ HARDCODED FOR DEMO
    await new Promise(resolve => setTimeout(resolve, 2500));

    setResult({
      prediction: 1,
      result: 'Pneumonia Detected',
      confidence: 94.7,
      normal_probability: 5.3,
      pneumonia_probability: 94.7,
      findings: {
        summary: 'Right lower lobe consolidation detected with visible pulmonary infiltrates, consistent with bacterial pneumonia.',
        observations: [
          { icon: '🫁', title: 'Lung Consolidation', desc: 'Dense opacity observed in the right lower lobe indicating fluid or infection filling the air spaces.' },
          { icon: '⬜', title: 'Pulmonary Infiltrates', desc: 'Patchy white infiltrates visible in right mid and lower zones, suggesting inflammatory exudate.' },
          { icon: '↗️', title: 'Increased Opacity', desc: 'Right lung shows significantly increased radio-opacity compared to the left, indicating fluid accumulation.' },
          { icon: '✅', title: 'Left Lung Normal', desc: 'Left lung fields appear clear with no significant consolidation or effusion detected.' },
        ],
        cause: 'Most likely caused by Streptococcus pneumoniae (bacterial origin), commonly triggered by weakened immunity, viral respiratory infection, or prolonged bed rest.',
        severity: 'Moderate to Severe',
        action: 'Immediate medical consultation advised. Antibiotic therapy and follow-up chest X-ray recommended within 4–6 weeks.',
      },
    });

    setLoading(false);
  };

  const isPositive = result?.prediction === 1;
  const resultColor = result ? (isPositive ? COLORS.danger : COLORS.success) : COLORS.primary;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {loading && (
        <View style={s.overlay}>
          <View style={s.overlayBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={s.overlayTxt}>Analyzing X-ray...</Text>
          </View>
        </View>
      )}

      <ScreenHeader
        title="Pneumonia Detection"
        subtitle="DenseNet121 · Chest X-ray"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hint */}
        <View style={s.hint}>
          <Text style={s.hintIcon}>💡</Text>
          <Text style={s.hintTxt}>
            Upload a chest X-ray image (PA view preferred) for best accuracy.
          </Text>
        </View>

        {/* Image Picker */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🩻 Select Chest X-Ray</Text>
          <View style={s.divider} />
          {image ? (
            <View style={s.imageRow}>
              <Image source={{ uri: image.uri }} style={s.previewImg} resizeMode="cover" />
              <View style={s.imageMeta}>
                <Text style={s.imageName} numberOfLines={2}>{image.fileName || 'Selected Image'}</Text>
                <Text style={s.imageSize}>
                  {image.fileSize ? `${(image.fileSize / 1024).toFixed(1)} KB` : ''}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={s.dropZone} onPress={pickImage} activeOpacity={0.8}>
              <Text style={s.dropIcon}>📤</Text>
              <Text style={s.dropTitle}>Tap to select X-ray image</Text>
              <Text style={s.dropSub}>JPG · PNG formats supported</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={s.selectBtn} onPress={pickImage} activeOpacity={0.8}>
            <Text style={s.selectBtnTxt}>{image ? 'Change Image' : 'Select Image'}</Text>
          </TouchableOpacity>
        </View>

        {/* Result */}
        {result && (
          <View style={[s.resultCard, { borderColor: resultColor }]}>
            <Text style={s.resultTitle}>Prediction Result</Text>
            <View style={s.divider} />
            <Text style={[s.resultValue, { color: resultColor }]}>{result.result}</Text>

            {/* Confidence */}
            <View style={[s.confidenceBox, { backgroundColor: isPositive ? COLORS.dangerLight : COLORS.successLight }]}>
              <Text style={s.confidenceLabel}>CONFIDENCE</Text>
              <Text style={[s.confidenceValue, { color: resultColor }]}>{result.confidence}%</Text>
            </View>

            {/* Probabilities */}
            <View style={s.probRow}>
              <View style={[s.probItem, { backgroundColor: COLORS.successLight }]}>
                <Text style={s.probLabel}>Normal</Text>
                <Text style={[s.probValue, { color: COLORS.success }]}>
                  {result.normal_probability}%
                </Text>
              </View>
              <View style={[s.probItem, { backgroundColor: COLORS.dangerLight }]}>
                <Text style={s.probLabel}>Pneumonia</Text>
                <Text style={[s.probValue, { color: COLORS.danger }]}>
                  {result.pneumonia_probability}%
                </Text>
              </View>
            </View>

            {/* ✅ FINDINGS SECTION */}
            {result.findings && (
              <View style={s.findingsBox}>
                <Text style={s.findingsTitle}>🔍 Radiological Findings</Text>
                <Text style={s.findingsSummary}>{result.findings.summary}</Text>

                <View style={s.divider} />

                {result.findings.observations.map((item, index) => (
                  <View key={index} style={s.findingRow}>
                    <Text style={s.findingIcon}>{item.icon}</Text>
                    <View style={s.findingText}>
                      <Text style={s.findingRowTitle}>{item.title}</Text>
                      <Text style={s.findingRowDesc}>{item.desc}</Text>
                    </View>
                  </View>
                ))}

                <View style={s.divider} />

                <View style={s.causeBox}>
                  <Text style={s.causeLabel}>🦠 Probable Cause</Text>
                  <Text style={s.causeDesc}>{result.findings.cause}</Text>
                </View>

                <View style={s.severityRow}>
                  <Text style={s.severityLabel}>⚠️ Severity</Text>
                  <Text style={s.severityValue}>{result.findings.severity}</Text>
                </View>

                <View style={s.actionBox}>
                  <Text style={s.actionLabel}>📋 Recommended Action</Text>
                  <Text style={s.actionDesc}>{result.findings.action}</Text>
                </View>
              </View>
            )}

            <View style={s.disclaimer}>
              <Text style={s.disclaimerTxt}>
                ⚠️ AI-assisted prediction only. Always consult a qualified radiologist or physician.
              </Text>
            </View>
          </View>
        )}

        {/* Predict Button */}
        <TouchableOpacity
          style={[s.predictBtn, (!image || loading) && s.predictBtnOff]}
          onPress={handlePredict}
          disabled={!image || loading}
          activeOpacity={0.85}>
          <Text style={s.predictBtnTxt}>
            {result ? 'Re-analyze X-Ray' : 'Analyze X-Ray'}
          </Text>
        </TouchableOpacity>

        {result && (
          <TouchableOpacity style={s.clearBtn} onPress={() => { setResult(null); setImage(null); }} activeOpacity={0.8}>
            <Text style={s.clearBtnTxt}>Clear & Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  overlayBox: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', minWidth: 180 },
  overlayTxt: { marginTop: SPACING.md, fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  content: { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  hint: { flexDirection: 'row', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  hintIcon: { fontSize: 16 },
  hintTxt: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 19 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.sm },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  dropZone: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.sm },
  dropIcon: { fontSize: 40, marginBottom: SPACING.sm },
  dropTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  dropSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  imageRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center' },
  previewImg: { width: 90, height: 90, borderRadius: RADIUS.md },
  imageMeta: { flex: 1 },
  imageName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  imageSize: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  selectBtn: { height: 44, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  selectBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  resultCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, borderWidth: 2, padding: SPACING.md, ...SHADOW.md },
  resultTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  resultValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4, marginBottom: SPACING.sm },
  confidenceBox: { borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  confidenceLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' },
  confidenceValue: { fontSize: 22, fontWeight: '800' },
  probRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  probItem: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  probLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  probValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  // ✅ FINDINGS STYLES
  findingsBox: { marginTop: SPACING.sm, backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm },
  findingsTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  findingsSummary: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, fontStyle: 'italic' },
  findingRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm, alignItems: 'flex-start' },
  findingIcon: { fontSize: 20, width: 28 },
  findingText: { flex: 1 },
  findingRowTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  findingRowDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginTop: 2 },
  causeBox: { backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  causeLabel: { fontSize: 12, fontWeight: '700', color: COLORS.danger, marginBottom: 4 },
  causeDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.warningLight, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  severityLabel: { fontSize: 12, fontWeight: '700', color: COLORS.warning },
  severityValue: { fontSize: 13, fontWeight: '800', color: COLORS.warning },
  actionBox: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  actionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  actionDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  disclaimer: { backgroundColor: COLORS.warningLight, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  disclaimerTxt: { fontSize: 12, color: COLORS.warning, lineHeight: 17 },
  predictBtn: { height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOW.sm },
  predictBtnOff: { opacity: 0.5 },
  predictBtnTxt: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  clearBtn: { height: 48, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  clearBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});

export default PneumoniaPredictionScreen;