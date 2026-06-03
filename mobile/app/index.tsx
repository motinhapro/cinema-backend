import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (isAuthenticated) return null;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🎬</Text>
        <Text style={styles.title}>Cinema App</Text>
        <Text style={styles.subtitle}>Seu cinema favorito, no seu bolso</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/register')}>
          <Text style={styles.registerButtonText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 80 },
  logoIcon: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#E50914', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#999', textAlign: 'center' },
  buttonContainer: { width: '100%', gap: 16 },
  loginButton: { backgroundColor: '#E50914', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  registerButton: { backgroundColor: 'transparent', paddingVertical: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E50914' },
  registerButtonText: { color: '#E50914', fontSize: 18, fontWeight: '600' },
});