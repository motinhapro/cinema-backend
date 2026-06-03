import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import AdminLanchesScreen from '../AdminLanchesScreen'; // 👈 Verifique se o caminho do import está batendo certinho com a sua estrutura

export default function ProfileTab() {
  const router = useRouter();
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👇 Estado que controla a alternância entre os dados do perfil e o gerenciador de lanches
  const [verGerenciadorLanches, setVerGerenciadorLanches] = useState(false);

  useEffect(() => {
    if (user) { setNome(user.nome || ''); setTelefone(user.telefone || ''); }
  }, [user]);

  async function handleUpdateProfile() {
    if (!nome) { Alert.alert('Erro', 'O nome não pode estar vazio'); return; }
    setLoading(true);
    try {
      await updateProfile({ nome, telefone, ...(novaSenha ? { senha: novaSenha } : {}) });
      Alert.alert('Sucesso', 'Perfil updated');
      setEditMode(false); setNovaSenha('');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally { setLoading(false); }
  }

  function handleDeleteAccount() {
    Alert.alert('Deletar Conta', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: async () => {
        setLoading(true); try { await deleteAccount(); router.replace('/'); } catch { Alert.alert('Erro', 'Não foi possível deletar'); } finally { setLoading(false); }
      }},
    ]);
  }

  async function handleLogout() { await logout(); router.replace('/'); }

  if (!user) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#E50914" /></View>;

  // ⚠️ INTERCEPTAÇÃO: Se você clicou para gerenciar os lanches, o perfil dá espaço para o painel do CRUD
  if (verGerenciadorLanches) {
    return (
      <View style={{ flex: 1, backgroundColor: '#141414' }}>
        {/* Barra superior de navegação para retornar ao Perfil principal */}
        <View style={styles.backBar}>
          <TouchableOpacity onPress={() => setVerGerenciadorLanches(false)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
            <Text style={styles.backBarText}>Voltar ao Perfil</Text>
          </TouchableOpacity>
        </View>
        <AdminLanchesScreen />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Ionicons name="person" size={40} color="#E50914" /></View>
        <Text style={styles.userName}>{user.nome}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* 👇 NOVA SEÇÃO INSERIDA: Menu administrativo da Bomboniere */}
      <View style={styles.adminSection}>
        <Text style={styles.sectionTitle}>Ações de Administrador</Text>
        <TouchableOpacity 
          style={styles.adminMenuBtn} 
          onPress={() => setVerGerenciadorLanches(true)}
        >
          <View style={styles.adminBtnLeft}>
            <Ionicons name="fast-food-outline" size={22} color="#E50914" />
            <Text style={styles.adminBtnText}>Gerenciar Bomboniere</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Perfil</Text>
        {editMode ? (
          <View style={styles.editForm}>
            <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#666" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#666" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Nova senha (opcional)" placeholderTextColor="#666" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Salvar</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditMode(false); setNome(user.nome || ''); setTelefone(user.telefone || ''); }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoDisplay}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nome</Text><Text style={styles.infoValue}>{user.nome}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{user.email}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Telefone</Text><Text style={styles.infoValue}>{user.telefone || 'Não informado'}</Text></View>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
              <Ionicons name="create-outline" size={18} color="#FFF" /><Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" /><Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Ionicons name="warning-outline" size={20} color="#FF5252" /><Text style={styles.deleteAccountText}>Deletar Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  loadingContainer: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#222' },
  avatar: { width: 80, height: 80, backgroundColor: '#1A1A1A', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#999' },
  section: { paddingHorizontal: 24, paddingVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  editForm: { gap: 12 },
  input: { backgroundColor: '#222', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#333' },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  saveButton: { backgroundColor: '#E50914', paddingVertical: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cancelButton: { borderWidth: 1, borderColor: '#666', paddingVertical: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
  cancelButtonText: { color: '#FFF', fontSize: 16 },
  infoDisplay: { gap: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#222' },
  infoLabel: { color: '#999', fontSize: 14 },
  infoValue: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#333', paddingVertical: 12, borderRadius: 8, marginTop: 8 },
  editButtonText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  actionsSection: { paddingHorizontal: 24, gap: 12, paddingBottom: 40, paddingTop: 10 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#333', paddingVertical: 14, borderRadius: 8 },
  logoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  deleteAccountButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#FF5252', paddingVertical: 14, borderRadius: 8 },
  deleteAccountText: { color: '#FF5252', fontSize: 16, fontWeight: '500' },

  // Estilos das seções de Admin e barra superior de retorno
  adminSection: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  adminMenuBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#262626' },
  adminBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminBtnText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  backBar: { backgroundColor: '#141414', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBarText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});