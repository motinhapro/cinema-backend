import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nome || !email || !senha || !confirmSenha) { Alert.alert('Erro', 'Preencha todos os campos obrigatórios'); return; }
    if (senha !== confirmSenha) { Alert.alert('Erro', 'As senhas não conferem'); return; }
    if (senha.length < 6) { Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres'); return; }
    setLoading(true);
    try {
      await register(nome, email, senha, telefone);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao criar conta');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Voltar</Text></TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#666" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Telefone (opcional)" placeholderTextColor="#666" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Senha (mín. 6 caracteres)" placeholderTextColor="#666" value={senha} onChangeText={setSenha} secureTextEntry />
          <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#666" value={confirmSenha} onChangeText={setConfirmSenha} secureTextEntry />
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar Conta</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 32, justifyContent: 'center', paddingVertical: 60 },
  backText: { color: '#E50914', fontSize: 16, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 40 },
  form: { gap: 16 },
  input: { backgroundColor: '#222', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#E50914', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});