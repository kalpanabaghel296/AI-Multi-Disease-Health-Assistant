import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Alert, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

// ── Defined OUTSIDE component so it never remounts ──────────────────────────
const Field = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, hint }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.fieldInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      secureTextEntry={secureTextEntry || false}
      keyboardType={keyboardType || 'default'}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="off"
      blurOnSubmit={false}
    />
    {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
  </View>
);

// ── Main screen ──────────────────────────────────────────────────────────────
const RegisterScreen = ({ navigation }) => {
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,         setLoading]         = useState(false);
  const { register } = useAuth();

  // useCallback so the handler reference stays stable
  const handleRegister = useCallback(async () => {
    if (!username.trim() || !email.trim() || !password.trim())
      return Alert.alert('Error', 'All fields are required.');
    if (password.length < 6)
      return Alert.alert('Error', 'Password must be at least 6 characters.');
    if (password !== confirmPassword)
      return Alert.alert('Error', 'Passwords do not match.');

    setLoading(true);
    try {
      await register(username.trim(), email.trim().toLowerCase(), password);
      Alert.alert(
        'Account Created! 🎉',
        'Your account is ready. Please sign in.',
        [{ text: 'Sign In', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert(
        'Registration Failed',
        err.response?.data?.detail || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [username, email, password, confirmPassword]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Loading overlay */}
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.overlayText}>Creating account…</Text>
          </View>
        </View>
      )}

      {/* Blue hero header */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroIcon}>🏥</Text>
        </View>
        <Text style={styles.heroTitle}>Create Account</Text>
        <Text style={styles.heroSub}>Join the Cognitive Health platform</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={styles.card}>

            <Field
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="dr_smith"
              hint="This will be your display name"
            />
            <Field
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@hospital.com"
              keyboardType="email-address"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
              secureTextEntry
            />
            <Field
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}>
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.submitBtnText}>Create Account  →</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginRow}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}>
            <Text style={styles.loginTxt}>
              Already have an account?{'  '}
              <Text style={styles.loginLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#1D4ED8' },
  flex:    { flex: 1 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  heroBadge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  heroIcon:  { fontSize: 34 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, letterSpacing: -0.4 },
  heroSub:   { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  // Scroll
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.lg,
  },

  // Field
  fieldWrap:  { marginBottom: SPACING.md },
  fieldLabel: {
    fontSize: 12, fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6, marginBottom: 7,
  },
  fieldInput: {
    height: 50,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  fieldHint: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  // Submit button
  submitBtn: {
    height: 52, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOW.sm,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  // Login row
  loginRow: { alignItems: 'center', paddingVertical: SPACING.sm },
  loginTxt:  { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  loginLink: { color: COLORS.white, fontWeight: '700' },

  // Overlay
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  overlayBox: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.xl, alignItems: 'center', minWidth: 180,
  },
  overlayText: {
    marginTop: SPACING.md, fontSize: 15,
    fontWeight: '600', color: COLORS.textSecondary,
  },
});

export default RegisterScreen;