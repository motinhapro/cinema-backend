import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { filmesService } from '../../services/filmes';
import { salasService, SalaData } from '../../services/salas'; 
import { Filme } from '../../types';

export default function MoviesTab() {
  const router = useRouter();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // ESTADOS DO CRUD DE FILMES
  // ==========================================
  const [movieModalVisible, setMovieModalVisible] = useState(false);
  const [editingFilmeId, setEditingFilmeId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [classificacao, setClassificacao] = useState('12');
  const [duracao, setDuracao] = useState('120');
  const [genero, setGenero] = useState('Ação');
  const [dataInicio, setDataInicio] = useState('2026-06-01');
  const [dataFinal, setDataFinal] = useState('2026-07-01');

  // ==========================================
  // ESTADOS DO CRUD DE SALAS
  // ==========================================
  const [salasModalVisible, setSalasModalVisible] = useState(false);
  const [salas, setSalas] = useState<SalaData[]>([]);
  const [editingSalaId, setEditingSalaId] = useState<string | null>(null);
  const [numeroSala, setNumeroSala] = useState('');
  const [capacidadeSala, setCapacidadeSala] = useState('');

  // Vetores fixos para alimentar as listagens do formulário
  const opcoesClassificacao = ['L', '10', '12', '14', '16', '18'];
  const opcoesGeneros = ['Ação', 'Comédia', 'Drama', 'Romance', 'Documentário', 'Suspense', 'Terror', 'Ficção Científica'];

  const generoMapInverso: Record<string, number> = {
    "Ação": 1, "Comédia": 2, "Drama": 3, "Romance": 4,
    "Documentário": 5, "Suspense": 6, "Terror": 7, "Ficção Científica": 8
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function loadData() {
    try {
      setLoading(true);
      const [filmesData, salasData] = await Promise.all([
        filmesService.findAll(),
        salasService.findAll()
      ]);
      setFilmes(filmesData);
      setSalas(salasData);
    } catch (error) {
      console.error('Erro ao carregar dados da Home:', error);
    } finally { setLoading(false); }
  }

  async function refreshSalas() {
    try {
      const data = await salasService.findAll();
      setSalas(data);
    } catch (err) { console.error(err); }
  }

  // ==========================================
  // FUNÇÕES DO FILME
  // ==========================================
  function handleOpenCreateMovie() {
    setEditingFilmeId(null);
    setTitulo(''); setSinopse(''); setClassificacao('12'); setDuracao('120'); setGenero('Ação');
    setMovieModalVisible(true);
  }

  function handleOpenEditMovie(filme: Filme) {
    setEditingFilmeId(filme.id);
    setTitulo(filme.titulo);
    setSinopse(filme.sinopse || '');
    setClassificacao(filme.classificacaoEtaria || 'L');
    setDuracao(String(filme.duracao));
    setGenero(typeof filme.genero === 'object' ? (filme.genero as any)?.nome : filme.genero);
    setMovieModalVisible(true);
  }

  async function handleSaveMovie() {
    if (!titulo || !duracao || !classificacao) { Alert.alert('Erro', 'Campos obrigatórios vazios!'); return; }
    
    // Captura a Foreign Key correta baseada no gênero selecionado
    const generoIdFinal = generoMapInverso[genero] || 1;

    try {
      if (editingFilmeId) {
        await filmesService.update(editingFilmeId, { 
          titulo, 
          duracao: Number(duracao), 
          classificacaoEtaria: classificacao,
          generoId: generoIdFinal 
        });
      } else {
        await filmesService.create({ 
          titulo, 
          sinopse, 
          classificacao, 
          duracao: Number(duracao), 
          genero, 
          generoId: generoIdFinal,
          dataInicioExibicao: dataInicio, 
          dataFinalExibicao: dataFinal 
        });
      }
      setMovieModalVisible(false);
      loadData();
    } catch { Alert.alert('Erro', 'Falha ao salvar filme.'); }
  }

  async function handleDeleteMovie(id: string, name: string) {
    Alert.alert('Deletar', `Remover "${name}"?`, [
      { text: 'Cancelar' },
      { text: 'Remover', style: 'destructive', onPress: async () => { await filmesService.remove(id); loadData(); } }
    ]);
  }

  // ==========================================
  // FUNÇÕES DA SALA
  // ==========================================
  async function handleSaveSala() {
    if (!numeroSala || !capacidadeSala) { Alert.alert('Erro', 'Preencha todos os campos da sala!'); return; }
    try {
      if (editingSalaId) {
        await salasService.update(editingSalaId, { numero: Number(numeroSala), capacidade: Number(capacidadeSala) });
      } else {
        await salasService.create({ numero: Number(numeroSala), capacidade: Number(capacidadeSala) });
      }
      setNumeroSala(''); setCapacidadeSala(''); setEditingSalaId(null);
      refreshSalas();
    } catch { Alert.alert('Erro', 'Não foi possível salvar a sala.'); }
  }

  async function handleDeleteSala(id: string, num: number) {
    try {
      await salasService.remove(id);
      refreshSalas();
    } catch { Alert.alert('Erro', 'Falha ao deletar sala. Ela pode estar em uso em alguma sessão.'); }
  }

  function getClassificacaoColor(c: string) {
    if (c === 'L') return '#4CAF50';
    const idade = parseInt(c);
    if (isNaN(idade)) return '#666';
    if (idade <= 12) return '#FFC107';
    if (idade <= 16) return '#FF5722';
    return '#F44336';
  }

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#E50914" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Em Cartaz</Text>
        <TouchableOpacity style={styles.salaManagerBtn} onPress={() => setSalasModalVisible(true)}>
          <Ionicons name="business-outline" size={22} color="#FFF" />
          <Text style={styles.salaManagerBtnText}>Salas</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList 
        data={filmes} 
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const nomeGenero = typeof item.genero === 'object' ? (item.genero as any)?.nome : item.genero;
          return (
            <View style={styles.movieCardContainer}>
              <TouchableOpacity style={styles.movieCard} onPress={() => router.push(`/movie/${item.id}`)}>
                <View style={styles.movieIcon}><Ionicons name="videocam" size={32} color="#E50914" /></View>
                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{item.titulo}</Text>
                  <Text style={styles.movieGenre}>{nomeGenero}</Text>
                  <View style={styles.movieMeta}>
                    <View style={[styles.classificacaoBadge, { backgroundColor: getClassificacaoColor(item.classificacaoEtaria) }]}>
                      <Text style={styles.classificacaoText}>{item.classificacaoEtaria}</Text>
                    </View>
                    <Text style={styles.movieDuration}>{item.duracao} min</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.actionButtonsColumn}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEditMovie(item)}><Ionicons name="pencil" size={18} color="#FFC107" /></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteMovie(item.id, item.titulo)}><Ionicons name="trash-outline" size={18} color="#F44336" /></TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum filme em cartaz no momento</Text>}
      />

      <TouchableOpacity style={styles.fabButton} onPress={handleOpenCreateMovie}><Ionicons name="add" size={30} color="#FFF" /></TouchableOpacity>

      {/* MODAL DE GERENCIAMENTO DE SALAS */}
      <Modal visible={salasModalVisible} animationType="fade" transparent={true} onRequestClose={() => setSalasModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
              <Text style={styles.modalTitle}>Gerenciar Salas</Text>
              <TouchableOpacity onPress={() => { setSalasModalVisible(false); setEditingSalaId(null); setNumeroSala(''); setCapacidadeSala(''); }}>
                <Ionicons name="close" size={26} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.salaFormInline}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Nº Sala" placeholderTextColor="#666" keyboardType="numeric" value={numeroSala} onChangeText={setNumeroSala} />
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Capacidade" placeholderTextColor="#666" keyboardType="numeric" value={capacidadeSala} onChangeText={setCapacidadeSala} />
              <TouchableOpacity style={styles.salaSaveBtn} onPress={handleSaveSala}>
                <Ionicons name={editingSalaId ? "checkmark" : "add"} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            {editingSalaId && <Text style={{ color: '#FFC107', fontSize: 12, alignSelf: 'flex-start', marginBottom: 12 }}>Editando Sala ID: {editingSalaId}</Text>}

            <ScrollView style={{ width: '100%', marginTop: 8 }}>
              {salas.length === 0 ? <Text style={{ color: '#666', textAlign: 'center', marginVertical: 20 }}>Nenhuma sala cadastrada.</Text> : (
                salas.map((s) => (
                  <View key={s.id} style={styles.salaListItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Ionicons name="business" size={20} color="#999" />
                      <View>
                        <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Sala {s.numero}</Text>
                        <Text style={{ color: '#666', fontSize: 13 }}>{s.capacidade} assentos</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity onPress={() => { setEditingSalaId(s.id); setNumeroSala(String(s.numero)); setCapacidadeSala(String(s.capacidade)); }}><Ionicons name="pencil" size={18} color="#FFC107" /></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteSala(s.id, s.numero)}><Ionicons name="trash-outline" size={18} color="#F44336" /></TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE FILMES ALTERADO */}
      <Modal visible={movieModalVisible} animationType="slide" transparent={true} onRequestClose={() => setMovieModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingFilmeId ? 'Editar Filme' : 'Novo Filme'}</Text>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
              
              <Text style={styles.inputLabel}>Título</Text>
              <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: Interestelar" placeholderTextColor="#666" />
              
              {/* 👇 SELETOR 1: Carrossel Horizontal de Gêneros Cadastrados */}
              <Text style={styles.inputLabel}>Gênero</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.generoScrollContainer}>
                {opcoesGeneros.map((itemGen) => (
                  <TouchableOpacity
                    key={itemGen}
                    style={[styles.generoItem, genero === itemGen && styles.generoItemSelected]}
                    onPress={() => setGenero(itemGen)}
                  >
                    <Ionicons name="film-outline" size={14} color={genero === itemGen ? '#FFF' : '#666'} />
                    <Text style={[styles.generoItemText, genero === itemGen && styles.generoItemTextActive]}>
                      {itemGen}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Duração (min)</Text>
                  <TextInput style={styles.input} value={duracao} onChangeText={setDuracao} keyboardType="numeric" placeholder="120" placeholderTextColor="#666" />
                </View>
              </View>

              {/* 👇 SELETOR 2: Grade de Chips de Classificação Etária */}
              <Text style={styles.inputLabel}>Classificação Etária</Text>
              <View style={styles.chipContainer}>
                {opcoesClassificacao.map((itemClass) => (
                  <TouchableOpacity
                    key={itemClass}
                    style={[styles.chipButton, classificacao === itemClass && styles.chipActive]}
                    onPress={() => setClassificacao(itemClass)}
                  >
                    <Text style={[styles.chipText, classificacao === itemClass && styles.chipTextActive]}>
                      {itemClass}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {!editingFilmeId && (
                <>
                  <Text style={styles.inputLabel}>Período de Exibição</Text>
                  <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} placeholder="Início YYYY-MM-DD" placeholderTextColor="#666" />
                  <TextInput style={styles.input} value={dataFinal} onChangeText={setDataFinal} placeholder="Final YYYY-MM-DD" placeholderTextColor="#666" />
                  
                  <Text style={styles.inputLabel}>Sinopse</Text>
                  <TextInput style={[styles.input, { height: 60 }]} value={sinopse} onChangeText={setSinopse} placeholder="Sinopse..." placeholderTextColor="#666" multiline />
                </>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setMovieModalVisible(false)}><Text style={styles.btnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={handleSaveMovie}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  loadingContainer: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  salaManagerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  salaManagerBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 24, paddingBottom: 80 },
  movieCardContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  movieCard: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16 },
  movieIcon: { width: 60, height: 60, backgroundColor: '#222', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  movieInfo: { flex: 1 },
  movieTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  movieGenre: { fontSize: 14, color: '#999', marginBottom: 8 },
  movieMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  classificacaoBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  classificacaoText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  movieDuration: { color: '#999', fontSize: 13 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 },
  actionButtonsColumn: { width: 50, backgroundColor: '#222', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8 },
  actionButton: { padding: 8 },
  fabButton: { position: 'absolute', right: 24, bottom: 24, backgroundColor: '#E50914', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 24, width: '100%', maxHeight: '85%', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  inputLabel: { color: '#AAA', fontSize: 13, marginBottom: 4, marginTop: 10, alignSelf: 'flex-start' },
  input: { backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFF', fontSize: 15, width: '100%', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnCancel: { backgroundColor: '#444' },
  btnSave: { backgroundColor: '#E50914' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  salaFormInline: { flexDirection: 'row', gap: 8, width: '100%', alignItems: 'center', marginBottom: 16, backgroundColor: '#1A1A1A', padding: 12, borderRadius: 8 },
  salaSaveBtn: { backgroundColor: '#E50914', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  salaListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },

  // 👇 NOVAS CLASSES DE ESTILIZAÇÃO DO CARROSSEL E CHIPS ADICIONADAS
  generoScrollContainer: { gap: 8, paddingVertical: 4, marginBottom: 8 },
  generoItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#444' },
  generoItemSelected: { backgroundColor: '#E50914', borderColor: '#b0060e' },
  generoItemText: { color: '#AAA', fontSize: 13, fontWeight: '500' },
  generoItemTextActive: { color: '#FFF', fontWeight: 'bold' },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: '100%', marginBottom: 8 },
  chipButton: { backgroundColor: '#333', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#444' },
  chipActive: { backgroundColor: '#E50914', borderColor: '#b0060e' },
  chipText: { color: '#AAA', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
});