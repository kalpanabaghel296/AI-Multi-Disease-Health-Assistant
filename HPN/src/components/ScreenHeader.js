import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOW } from '../../config';

const ScreenHeader = ({ title, subtitle, onBack }) => (
  <View style={s.header}>
    {onBack && (
      <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={s.backIcon}>←</Text>
      </TouchableOpacity>
    )}
    <View style={s.titleWrap}>
      <Text style={s.title} numberOfLines={1}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

const s = StyleSheet.create({
  header:    { backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, ...SHADOW.sm },
  backBtn:   { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  backIcon:  { fontSize: 20, color: COLORS.primary, fontWeight: '700' },
  titleWrap: { flex: 1 },
  title:     { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle:  { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});

export default ScreenHeader;