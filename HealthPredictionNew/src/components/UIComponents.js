import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, Modal,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

export const Card = ({ children, style }) => (
  <View style={[ui.card, style]}>{children}</View>
);

export const PrimaryButton = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[ui.primaryBtn, disabled && ui.btnDisabled, style]}
    onPress={onPress} disabled={disabled} activeOpacity={0.8}
  >
    <Text style={ui.primaryBtnTxt}>{title}</Text>
  </TouchableOpacity>
);

export const OutlineButton = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[ui.outlineBtn, disabled && ui.btnDisabled, style]}
    onPress={onPress} disabled={disabled} activeOpacity={0.8}
  >
    <Text style={ui.outlineBtnTxt}>{title}</Text>
  </TouchableOpacity>
);

export const DangerButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[ui.dangerBtn, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={ui.dangerBtnTxt}>{title}</Text>
  </TouchableOpacity>
);

export const Divider = ({ style }) => <View style={[ui.divider, style]} />;

export const Badge = ({ label, type = 'primary' }) => {
  const palette = {
    primary: { bg: COLORS.primaryLight, text: COLORS.primary },
    success: { bg: COLORS.successLight, text: COLORS.success },
    warning: { bg: COLORS.warningLight, text: COLORS.warning },
    danger:  { bg: COLORS.dangerLight,  text: COLORS.danger  },
  };
  const c = palette[type] || palette.primary;
  return (
    <View style={[ui.badge, { backgroundColor: c.bg }]}>
      <Text style={[ui.badgeTxt, { color: c.text }]}>{label}</Text>
    </View>
  );
};

export const LoadingOverlay = ({ message }) => (
  <Modal transparent animationType="fade" statusBarTranslucent>
    <View style={ui.overlayBg}>
      <View style={ui.overlayCard}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={ui.overlayTxt}>{message || 'Loading…'}</Text>
      </View>
    </View>
  </Modal>
);

const ui = StyleSheet.create({
  card:          { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.sm },
  primaryBtn:    { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center' },
  primaryBtnTxt: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  outlineBtn:    { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center' },
  outlineBtnTxt: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  dangerBtn:     { backgroundColor: COLORS.danger, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center' },
  dangerBtnTxt:  { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  btnDisabled:   { opacity: 0.45 },
  divider:       { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  badge:         { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  badgeTxt:      { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  overlayBg:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  overlayCard:   { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.md, minWidth: 180, ...SHADOW.lg },
  overlayTxt:    { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600', textAlign: 'center' },
});