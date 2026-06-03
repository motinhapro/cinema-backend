import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lancheComboService } from '../services/lanche-combo';
import { LancheCombo } from '../types';

export default function AdminLanchesScreen() {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLancheId, setSelectedLancheId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');

  useEffect(() => { loadLanches(); }, []);

  async function loadLanches() {
    try {
      setLoading(true);
      const data = await lancheComboService.findAll();
      console.log('Lanches carregados:', data); 
      setLanches(data);
    } catch (error) {
      console.error('Erro ao buscar lanches:', error);
    } finally { setLoading(false); }
  }

  function handleOpenCreate() {
    setSelectedLancheId(null);
    setNome(''); setDescricao(''); setPreco('');
    setModalVisible(true);
  }

  function handleOpenEdit(lanche: LancheCombo) {
    setSelectedLancheId(Number(lanche.id)); 
    setNome(lanche.nome);
    setDescricao(lanche.descricao);
  
    const valorReal = lanche.preco ?? (lanche as any).valorUnitario ?? 0;
    setPreco(String(valorReal));
    
    setModalVisible(true);
  }

  async function handleSaveLanche() {
    if (!nome || !descricao || !preco) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const precoNumerico = parseFloat(preco.trim().replace(',', '.'));

      if (isNaN(precoNumerico)) {
        Alert.alert('Erro', 'Preço inválido.');
        return;
      }

      const payload = { nome, descricao, valorUnitario: precoNumerico };

      if (selectedLancheId) {
        await lancheComboService.update(selectedLancheId, payload);
        Alert.alert('Sucesso', 'Combo atualizado!');
      } else {
        await lancheComboService.create(payload);
        Alert.alert('Sucesso', 'Cadastrado com sucesso!');
      }

      setModalVisible(false);
      loadLanches();
    } catch (error: any) {
      console.error('Erro ao salvar:', error.response?.data || error.message);
      Alert.alert('Erro', `Falha ao salvar: ${error.response?.data?.message || 'Erro de conexão'}`);
    } finally { setLoading(false); }
  }

  async function handleDeleteLanche(idParaDeletar: any) {
    console.log('--- PROCESSANDO EXCLUSÃO ---');
    
    const idNumerico = Number(idParaDeletar);

    if (isNaN(idNumerico)) {
      Alert.alert('Erro', 'ID do combo inválido.');
      return;
    }

    const executarExclusao = async () => {
      try {
        setLoading(true);
        console.log('Disparando requisição DELETE para a API com o ID:', idNumerico);
        
        // 1. Chama o service passando o número
        await lancheComboService.remove(idNumerico);
        
        // 2. Filtro corrigido comparando número com número (=== ou !== seguro)
        setLanches((listaAtual) => listaAtual.filter((lanche) => Number(lanche.id) !== idNumerico));
        
        Alert.alert('Sucesso', 'Combo removido da bomboniere!');
      } catch (error: any) {
        console.error('Erro na requisição Axios de DELETE:', error.response?.data || error.message);
        Alert.alert('Erro ao Deletar', error.response?.data?.message || 'Erro no servidor.');
      } finally {
        setLoading(false);
      }
    };

    // ✨ COMPATIBILIDADE WEB: O Alert.alert falha na Web se não tiver polyfill. 
    // Usamos o confirm padrão dos navegadores se estiver na Web.
    if (typeof window !== 'undefined' && (window as any).confirm) {
      if (window.confirm('Tem certeza que deseja remover este item permanentemente?')) {
        await executarExclusao();
      }
    } else {
      // Código nativo para quando você rodar no celular (iOS/Android)
      Alert.alert('Excluir Combo', 'Tem certeza que deseja remover este item permanentemente?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: executarExclusao }
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Bomboniere</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenCreate}>
          <Ionicons name="add-circle-outline" size={20} color="#E50914" />
          <Text style={styles.addBtnText}>Combo</Text>
        </TouchableOpacity>
      </View>

      {loading && lanches.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#E50914" /></View>
      ) : (
        <FlatList
          data={lanches}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={54} color="#333" />
              <Text style={styles.emptyText}>Lista vazia.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const valorExibicao = item.preco ?? (item as any).valorUnitario ?? 0;

            return (
              <View style={styles.lancheCard}>
                {/* 1. Recuo na direita para impedir o texto de cobrir os botões */}
                <View style={{ flex: 1, gap: 4, paddingRight: 8 }}>
                  <Text style={styles.lancheNome}>{item.nome}</Text>
                  <Text style={styles.lancheDesc}>{item.descricao}</Text>
                  <Text style={styles.lanchePreco}>R$ {Number(valorExibicao).toFixed(2)}</Text> 
                </View>

                {/* 2. Coluna isolada e fixa com Z-Index alto */}
                <View style={styles.actionsColumn}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenEdit(item)}>
                    <Ionicons name="pencil" size={16} color="#FFC107" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteLanche(item.id)}>
                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedLancheId ? 'Editar' : 'Novo'}</Text>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 14 }}>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" placeholderTextColor="#666" />
              <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Descrição" placeholderTextColor="#666" />
              <TextInput style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" placeholder="Preço" placeholderTextColor="#666" />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Sair</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={handleSaveLanche}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  
  // Lista Cards
  lancheCard: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#262626', alignItems: 'center' },
  lancheNome: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  lancheDesc: { color: '#999', fontSize: 13 },
  lanchePreco: { color: '#FFC107', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  
  // Modificações Cruciais de Layout para Liberar o Clique
  actionsColumn: { 
    width: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 16, 
    marginLeft: 6, 
    borderLeftWidth: 1, 
    borderLeftColor: '#262626' 
  },
  actionBtn: { 
    padding: 10, // Aumenta de verdade a área de toque invisível
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 10 // Força ficar na camada superior da interface
  },
  
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyText: { color: '#888', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 24, width: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  input: { backgroundColor: '#333', borderRadius: 8, padding: 12, color: '#FFF', marginBottom: 10 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnCancel: { backgroundColor: '#444' },
  btnSave: { backgroundColor: '#E50914' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});