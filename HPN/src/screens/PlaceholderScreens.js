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

// ── Reusable Image Prediction Screen ─────────────────────────────────────────
const ImagePredictionScreen = ({
  navigation,
  title,
  subtitle,
  icon,
  type, // 'dermatosis' or 'pneumonia'
  hint,
  resultConfig,
}) => {
  const [image, setImage]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.9 },
      (resp) => {
        if (resp.didCancel || resp.errorCode) return;
        const asset = resp.assets?.[0];
        if (asset) {
          setImage(asset);
          setResult(null);
        }
      }
    );
  };

  const handlePredict = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }
    setLoading(true);
    try {
      let data;
      if (type === 'dermatosis') {
        data = await predictionService.predictDermatosis(image);
      } else {
        data = await predictionService.predictPneumonia(image);
      }
      if (data.error) {
        Alert.alert('Prediction Error', data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.detail || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    if (!result) return COLORS.primary;
    if (type === 'pneumonia') {
      return result.prediction === 1 ? COLORS.danger : COLORS.success;
    }
    return COLORS.primary;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.overlayTxt}>Analyzing image...</Text>
          </View>
        </View>
      )}

      <ScreenHeader
        title={title}
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Hint */}
        <View style={styles.hintBox}>
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintTxt}>{hint}</Text>
        </View>

        {/* Image Picker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{icon} Select Image</Text>
          <View style={styles.divider} />

          {image ? (
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: image.uri }}
                style={styles.previewImg}
                resizeMode="cover"
              />
              <View style={styles.imageInfo}>
                <Text style={styles.imageName} numberOfLines={1}>
                  {image.fileName || 'Selected Image'}
                </Text>
                <Text style={styles.imageSize}>
                  {image.fileSize
                    ? `${(image.fileSize / 1024).toFixed(1)} KB`
                    : ''}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.dropZone}
              onPress={pickImage}
              activeOpacity={0.8}>
              <Text style={styles.dropIcon}>📤</Text>
              <Text style={styles.dropTitle}>Tap to select image</Text>
              <Text style={styles.dropSub}>JPG · PNG formats supported</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.selectBtn}
            onPress={pickImage}
            activeOpacity={0.8}>
            <Text style={styles.selectBtnTxt}>
              {image ? 'Change Image' : 'Select Image'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Result Card */}
        {result && (
          <View style={[styles.resultCard, { borderColor: getResultColor() }]}>
            <Text style={styles.resultTitle}>Prediction Result</Text>
            <View style={styles.divider} />

            <Text style={[styles.resultValue, { color: getResultColor() }]}>
              {result.result}
            </Text>

            <View style={styles.confidenceRow}>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceLabel}>Confidence</Text>
                <Text style={[styles.confidenceValue, { color: getResultColor() }]}>
                  {result.confidence}%
                </Text>
              </View>
            </View>

            {/* Pneumonia extra info */}
            {type === 'pneumonia' && (
              <View style={styles.probRow}>
                <View style={styles.probItem}>
                  <Text style={styles.probLabel}>Normal</Text>
                  <Text style={[styles.probValue, { color: COLORS.success }]}>
                    {result.normal_probability}%
                  </Text>
                </View>
                <View style={styles.probItem}>
                  <Text style={styles.probLabel}>Pneumonia</Text>
                  <Text style={[styles.probValue, { color: COLORS.danger }]}>
                    {result.pneumonia_probability}%
                  </Text>
                </View>
              </View>
            )}

            {/* Dermatosis all probabilities */}
            {type === 'dermatosis' && result.all_probabilities && (
              <View style={styles.allProbs}>
                <Text style={styles.allProbsTitle}>All Class Probabilities</Text>
                {Object.entries(result.all_probabilities)
                  .sort((a, b) => b[1] - a[1])
                  .map(([label, prob]) => (
                    <View key={label} style={styles.probBarRow}>
                      <Text style={styles.probBarLabel} numberOfLines={1}>
                        {label}
                      </Text>
                      <View style={styles.probBarBg}>
                        <View
                          style={[
                            styles.probBarFill,
                            {
                              width: `${prob}%`,
                              backgroundColor:
                                label === result.result
                                  ? COLORS.primary
                                  : COLORS.border,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.probBarPct}>{prob}%</Text>
                    </View>
                  ))}
              </View>
            )}

            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTxt}>
                ⚠️ This is an AI-assisted prediction. Always consult a
                qualified dermatologist/radiologist for diagnosis.
              </Text>
            </View>
          </View>
        )}

        {/* Predict Button */}
        <TouchableOpacity
          style={[
            styles.predictBtn,
            (!image || loading) && styles.predictBtnDisabled,
          ]}
          onPress={handlePredict}
          disabled={!image || loading}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.predictBtnTxt}>
              {result ? 'Re-analyze Image' : 'Analyze Image'}
            </Text>
          )}
        </TouchableOpacity>

        {result && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => { setResult(null); setImage(null); }}
            activeOpacity={0.8}>
            <Text style={styles.clearBtnTxt}>Clear & Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Dermatosis Screen ─────────────────────────────────────────────────────────
export const DermatosisPredictionScreen = ({ navigation }) => (
  <ImagePredictionScreen
    navigation={navigation}
    title="Dermatosis Detection"
    subtitle="ResNet50 CNN · 7 skin conditions"
    icon="🔬"
    type="dermatosis"
    hint="Upload a clear close-up photo of the affected skin area in good lighting."
  />
);

// ── Pneumonia Screen ──────────────────────────────────────────────────────────
export const PneumoniaPredictionScreen = ({ navigation }) => (
  <ImagePredictionScreen
    navigation={navigation}
    title="Pneumonia Detection"
    subtitle="DenseNet121 CNN · Chest X-ray"
    icon="🩻"
    type="pneumonia"
    hint="Upload a chest X-ray image (PA view preferred) for best accuracy."
  />
);

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  overlayBox: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.xl, alignItems: 'center', minWidth: 180,
  },
  overlayTxt: { marginTop: SPACING.md, fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  content: { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  hintBox: {
    flexDirection: 'row', backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm,
  },
  hintIcon: { fontSize: 16 },
  hintTxt: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 19 },
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.md, ...SHADOW.sm,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  dropZone: {
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    borderRadius: RADIUS.lg, padding: SPACING.xl,
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  dropIcon: { fontSize: 40, marginBottom: SPACING.sm },
  dropTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  dropSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  imagePreview: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center' },
  previewImg: { width: 90, height: 90, borderRadius: RADIUS.md },
  imageInfo: { flex: 1 },
  imageName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  imageSize: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  selectBtn: {
    height: 44, borderRadius: RADIUS.sm, borderWidth: 1.5,
    borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  selectBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  resultCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    borderWidth: 2, padding: SPACING.md, ...SHADOW.md,
  },
  resultTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  resultValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4, marginBottom: SPACING.sm },
  confidenceRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  confidenceBadge: {
    backgroundColor: COLORS.background, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  confidenceLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' },
  confidenceValue: { fontSize: 22, fontWeight: '800' },
  probRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  probItem: {
    flex: 1, backgroundColor: COLORS.background,
    borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center',
  },
  probLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  probValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  allProbs: { marginTop: SPACING.sm },
  allProbsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  probBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: SPACING.sm },
  probBarLabel: { fontSize: 11, color: COLORS.textSecondary, width: 120 },
  probBarBg: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  probBarFill: { height: '100%', borderRadius: 4 },
  probBarPct: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, width: 40, textAlign: 'right' },
  disclaimer: { backgroundColor: COLORS.warningLight, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  disclaimerTxt: { fontSize: 12, color: COLORS.warning, lineHeight: 17 },
  predictBtn: {
    height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', ...SHADOW.sm,
  },
  predictBtnDisabled: { opacity: 0.5 },
  predictBtnTxt: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  clearBtn: {
    height: 48, borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  clearBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});