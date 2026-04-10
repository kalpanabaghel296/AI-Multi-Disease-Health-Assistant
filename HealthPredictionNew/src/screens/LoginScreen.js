import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, LoadingOverlay } from '../components/UIComponents';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
  if (!email.trim() || !password)
    return Alert.alert('Missing Fields', 'Please enter your email and password.');

  setLoading(true);

  try {
    await login(email.trim().toLowerCase(), password);

    // ✅ Success handled automatically via AuthContext

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    const msg =
      err.response?.data?.detail ||
      err.message ||
      'Invalid email or password. Please try again.';

    Alert.alert('Login Failed', msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={s.safe}>
      {loading && <LoadingOverlay message="Signing in…" />}
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={s.hero}>
            <View style={s.logoWrap}><Text style={s.logoIcon}>🧬</Text></View>
            <Text style={s.heroTitle}>Cognitive Health AI</Text>
            <Text style={s.heroSub}>AI-powered healthcare predictions & insights</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Sign In</Text>
            <Text style={s.cardSub}>Access your health dashboard</Text>

            <View style={s.field}>
              <Text style={s.label}>Email Address</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <View>
                <TextInput
                  style={[s.input, s.passInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={s.showBtn} onPress={() => setShowPass(p => !p)}>
                  <Text style={s.showTxt}>{showPass ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <PrimaryButton title="Sign In" onPress={handleLogin} style={s.btn} />

            <View style={s.switchRow}>
              <Text style={s.switchTxt}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={s.switchLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.disclaimer}>
            For medical decision support only. Not a substitute for professional care.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.primary },
  flex:       { flex: 1 },
  scroll:     { flexGrow: 1, justifyContent: 'center', padding: SPACING.md, paddingBottom: SPACING.xl },
  hero:       { alignItems: 'center', paddingVertical: SPACING.xl },
  logoWrap:   { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  logoIcon:   { fontSize: 42 },
  heroTitle:  { fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5 },
  heroSub:    { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6, textAlign: 'center' },
  card:       { backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, ...SHADOW.lg },
  cardTitle:  { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardSub:    { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  field:      { marginBottom: SPACING.md },
  label:      { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input:      { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 13, fontSize: 15, color: COLORS.textPrimary },
  passInput:  { paddingRight: 70 },
  showBtn:    { position: 'absolute', right: SPACING.md, top: 0, bottom: 0, justifyContent: 'center' },
  showTxt:    { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  btn:        { marginTop: SPACING.sm, marginBottom: SPACING.md },
  switchRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchTxt:  { fontSize: 14, color: COLORS.textSecondary },
  switchLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  disclaimer: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: SPACING.lg, paddingHorizontal: SPACING.md, lineHeight: 16 },
});

export default LoginScreen;