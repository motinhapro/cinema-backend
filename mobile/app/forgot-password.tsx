import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    if (!email) { Alert.alert('Erro', 'Informe seu email'); return; }
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      Alert.alert('Sucesso', response.message, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao solicitar recuperação');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Voltar</Text></TouchableOpacity>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.description}>Digite seu email cadastrado e enviaremos instruções para redefinir sua senha.</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleForgotPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingHorizontal: 32, justifyContent: 'center' },
  backText: { color: '#E50914', fontSize: 16, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  description: { fontSize: 14, color: '#999', marginBottom: 32, lineHeight: 20 },
  form: { gap: 16 },
  input: { backgroundColor: '#222', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#E50914', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});