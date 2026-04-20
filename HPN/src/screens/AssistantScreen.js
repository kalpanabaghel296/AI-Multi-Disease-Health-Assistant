import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { assistantService } from '../services/assistantService'; 
import { COLORS, SPACING, RADIUS, SHADOW } from '../../config';

const SUGGESTIONS = [
  'What are the symptoms of diabetes?',
  'How to lower blood pressure naturally?',
  'What causes chest pain?',
  'Signs of lung cancer to watch out for',
  'What is a normal BMI range?',
  'How can I reduce cholesterol?',
];

const AssistantScreen = () => {
  const [messages, setMessages] = useState([{
    id: '0', role: 'assistant',
    text: "Hello! I'm your AI health assistant powered by Llama 3. Ask me about symptoms, medications, or general health topics — I'm here to help! 🩺",
    ts: new Date(),
  }]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const scrollRef             = useRef(null);

  useEffect(() => { setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150); }, [messages, typing]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text: msg, ts: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput(''); setTyping(true);
    try {
      const data = await assistantService.sendMessage(msg);
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', text: data.response || 'No response received.', ts: new Date() }]);
    } catch {
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', text: 'Sorry, I encountered an error. Please check your connection and try again.', ts: new Date(), err: true }]);
    } finally { setTyping(false); }
  };

  const fmtTime = d => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.botDot}><Text style={s.botDotTxt}>🤖</Text></View>
          <View>
            <Text style={s.headerTitle}>Health Assistant</Text>
            <View style={s.onlineRow}><View style={s.onlineDot} /><Text style={s.onlineTxt}>Llama 3 · Online</Text></View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>

        <ScrollView ref={scrollRef} style={s.msgList} contentContainerStyle={s.msgContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {messages.map(m => (
            <View key={m.id} style={[s.row, m.role === 'user' ? s.rowUser : s.rowBot]}>
              {m.role === 'assistant' && <View style={s.miniAvatar}><Text style={s.miniAvatarTxt}>⚕</Text></View>}
              <View style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleBot, m.err && s.bubbleErr]}>
                <Text style={[s.bubbleTxt, m.role === 'user' ? s.bubbleTxtUser : s.bubbleTxtBot]}>{m.text}</Text>
                <Text style={[s.ts, m.role === 'user' ? s.tsUser : s.tsBot]}>{fmtTime(m.ts)}</Text>
              </View>
            </View>
          ))}

          {typing && (
            <View style={[s.row, s.rowBot]}>
              <View style={s.miniAvatar}><Text style={s.miniAvatarTxt}>⚕</Text></View>
              <View style={[s.bubble, s.bubbleBot, s.typingBubble]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={s.typingTxt}>Thinking…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestion chips */}
        {messages.length <= 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips} contentContainerStyle={s.chipsContent}>
            {SUGGESTIONS.map((q, i) => (
              <TouchableOpacity key={i} style={s.chip} onPress={() => send(q)} activeOpacity={0.8}>
                <Text style={s.chipTxt}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={s.inputBar}>
          <TextInput
            style={s.inputField}
            value={input} onChangeText={setInput}
            placeholder="Ask a health question…"
            placeholderTextColor={COLORS.textMuted}
            multiline maxLength={500}
          />
          <TouchableOpacity style={[s.sendBtn, (!input.trim() || typing) && s.sendBtnOff]} onPress={() => send()} disabled={!input.trim() || typing} activeOpacity={0.8}>
            <Text style={s.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: { backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  botDot: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  botDotTxt: { fontSize: 20 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.success },
  onlineTxt: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  msgList: { flex: 1 },
  msgContent: { padding: SPACING.md, paddingBottom: SPACING.sm },
  row: { flexDirection: 'row', marginBottom: SPACING.sm, alignItems: 'flex-end' },
  rowUser: { justifyContent: 'flex-end' },
  rowBot:  { justifyContent: 'flex-start' },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 6, marginBottom: 2 },
  miniAvatarTxt: { fontSize: 13 },
  bubble: { maxWidth: '76%', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleBot:  { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, ...SHADOW.sm },
  bubbleErr:  { backgroundColor: COLORS.dangerLight },
  bubbleTxt: { fontSize: 15, lineHeight: 22 },
  bubbleTxtUser: { color: COLORS.white },
  bubbleTxtBot:  { color: COLORS.textPrimary },
  ts: { fontSize: 10, marginTop: 4 },
  tsUser: { color: 'rgba(255,255,255,0.55)', textAlign: 'right' },
  tsBot:  { color: COLORS.textMuted },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  typingTxt: { fontSize: 13, color: COLORS.textSecondary },
  chips: { maxHeight: 52, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  chipsContent: { paddingHorizontal: SPACING.md, paddingVertical: 10, gap: SPACING.sm },
  chip: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primary + '33' },
  chipTxt: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: SPACING.sm, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.sm },
  inputField: { flex: 1, minHeight: 44, maxHeight: 110, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: 15, color: COLORS.textPrimary, borderWidth: 1.5, borderColor: COLORS.border },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOW.sm },
  sendBtnOff: { backgroundColor: COLORS.border },
  sendIcon: { fontSize: 22, color: COLORS.white, fontWeight: '700' },
});

export default AssistantScreen;