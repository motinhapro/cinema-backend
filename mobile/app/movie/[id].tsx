import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { filmesService } from '../../services/filmes';
import { sessoesService } from '../../services/sessoes';
import { salasService, SalaData } from '../../services/salas';
import { lancheComboService } from '../../services/lanche-combo';
import { ingressosService } from '../../services/ingressos';
import { pedidosService } from '../../services/pedidos';
import { Filme, Sessao, LancheCombo, Pedido } from '../../types';

export default function MovieDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [salas, setSalas] = useState<SalaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [combosDisponiveis, setCombosDisponiveis] = useState<LancheCombo[]>([]);

  // Estados do Modal de Configuração de Sessão (Admin)
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSessaoId, setEditingSessaoId] = useState<string | null>(null);
  const [salaId, setSalaId] = useState('');
  const [dataHora, setDataHora] = useState('02/06/2026 21:00');
  const [valorIngresso, setValorIngresso] = useState('25.00');

  // Controle dos Modais de Compra e Recibo (Cliente)
  const [compraModalVisible, setCompraModalVisible] = useState(false);
  const [lancheModalVisible, setLancheModalVisible] = useState(false); 
  const [reciboModalVisible, setReciboModalVisible] = useState(false);
  const [selectedSessao, setSelectedSessao] = useState<Sessao | null>(null);

  // Controle do Grid Interativo de Assentos
  // 👇 1. Ajustado para aceitar estritamente 'INTEIRA' ou 'MEIA'
  const [tipoIngresso, setTipoIngresso] = useState<'INTEIRA' | 'MEIA'>('INTEIRA');
  const [assentosSelecionados, setAssentosSelecionados] = useState<string[]>([]);
  const [assentosOcupados, setAssentosOcupados] = useState<string[]>([]);
  const [lancheSelecionadoId, setLancheSelecionadoId] = useState<number | null>(null);

  // Estado para o Comprovante de Pagamento Consolidado
  const [ultimoPedidoCriado, setUltimoPedidoCriado] = useState<Pedido | null>(null);

  const fileiras = ['A', 'B', 'C', 'D', 'E'];
  const colunas = ['1', '2', '3', '4', '5', '6'];

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    const idNumerico = Number(id);
    if (!id || isNaN(idNumerico) || id === '[id]' || id === ':id') return; 

    try {
      setLoading(true);
      const [filmeData, sessoesData, salasData, lanchesData] = await Promise.all([
        filmesService.findOne(id),
        sessoesService.findAll(),
        salasService.findAll(),
        lancheComboService.findAll()
      ]);
      
      setFilme(filmeData);
      setSalas(salasData);
      setCombosDisponiveis(lanchesData);
      
      const sessoesFilme = sessoesData.filter((s: any) => String(s.filmeId) === String(id));
      setSessoes(sessoesFilme);
    } catch (error) {
      console.error('Erro ao carregar dados do detalhe:', error);
    } finally { setLoading(false); }
  }
  
  async function refreshSessoes() {
    try {
      const sessoesData = await sessoesService.findAll();
      const sessoesFilme = sessoesData.filter((s: any) => String(s.filmeId) === String(id));
      setSessoes(sessoesFilme);
    } catch (err) { console.error(err); }
  }

  function formatDate(d: string) { 
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); 
  }
  
  function formatTime(d: string) { 
    if (!d) return '';
    return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); 
  }

  function handleOpenCreateSessao() {
    setEditingSessaoId(null);
    setSalaId(salas.length > 0 ? salas[0].id.toString() : '');
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setDataHora(dataFormatada);
    setValorIngresso('25.00');
    setModalVisible(true);
  }

  function handleOpenEditSessao(sessao: any) {
    setEditingSessaoId(sessao.id);
    setSalaId(String(sessao.salaId));
    const dataBanco = new Date(sessao.horario || sessao.horarioInicio);
    const dataFormatada = dataBanco.toLocaleDateString('pt-BR') + ' ' + dataBanco.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setDataHora(dataFormatada);
    setValorIngresso(sessao.valorIngresso ? String(sessao.valorIngresso) : '20.00');
    setModalVisible(true);
  }

  function converterBrParaIso(dataBr: string): string {
    try {
      const [data, hora] = dataBr.split(' ');
      const [dia, mes, ano] = data.split('/');
      return `${ano}-${mes}-${dia}T${hora}:00.000Z`;
    } catch { return dataBr; }
  }

  async function handleSaveSessao() {
    if (!salaId || !dataHora) {
      Alert.alert('Erro', 'Por favor, preencha a sala e o horário.');
      return;
    }
    const dataParaEnvio = converterBrParaIso(dataHora);
    try {
      if (editingSessaoId) {
        await sessoesService.update(editingSessaoId, {
          horarioInicio: dataParaEnvio,
          salaId: Number(salaId),
          filmeId: Number(id),
          valorIngresso: Number(valorIngresso)
        });
        Alert.alert('Sucesso', 'Sessão atualizada!');
      } else {
        await sessoesService.create({
          filmeId: Number(id),
          salaId: Number(salaId),
          horario: dataParaEnvio,
          valorIngresso: Number(valorIngresso)
        });
        Alert.alert('Sucesso', 'Sessão criada com sucesso!');
      }
      setModalVisible(false);
      refreshSessoes();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro na API', 'Erro ao salvar dados da sessão.');
    }
  }

  async function handleDeleteSessao(sessaoId: string) {
    if (!sessaoId) return;
    async function executarExclusao() {
      try {
        setLoading(true);
        await sessoesService.remove(sessaoId);
        await refreshSessoes();
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível remover a sessão.');
      } finally { setLoading(false); }
    }
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Tem certeza que deseja remover esta sessão?')) await executarExclusao();
    } else {
      Alert.alert('Excluir', 'Tem certeza?', [{ text: 'Não' }, { text: 'Sim', onPress: executarExclusao }]);
    }
  }

  async function handleAbrirCompra(sessao: Sessao) {
    setSelectedSessao(sessao);
    setAssentosSelecionados([]);
    setLancheSelecionadoId(null);
    setTipoIngresso('INTEIRA'); // Reseta para o padrão limpo

    try {
      const ingressosVendidos = await ingressosService.findAll(sessao.id);
      const ocupados = ingressosVendidos.map((ing: any) => ing.assento);
      setAssentosOcupados(ocupados);
      setCompraModalVisible(true);
    } catch (error) {
      console.error('Erro ao buscar assentos ocupados:', error);
      Alert.alert('Erro', 'Não foi possível carregar o mapa de ocupação da sala.');
    }
  }

  function handleSelectAssento(assento: string) {
    if (assentosOcupados.includes(assento)) return;

    if (assentosSelecionados.includes(assento)) {
      setAssentosSelecionados(assentosSelecionados.filter(a => a !== assento));
    } else {
      setAssentosSelecionados([...assentosSelecionados, assento]);
    }
  }

  function handleAvancarParaLanches() {
    if (!selectedSessao) return;
    if (assentosSelecionados.length === 0) {
      Alert.alert('Aviso', 'Selecione ao menos um assento antes de avançar.');
      return;
    }
    setCompraModalVisible(false);
    setLancheModalVisible(true);
  }

  async function handleFinalizarPedido() {
    if (!selectedSessao) return;

    try {
      setLoading(true);

      // Calcula o preço correto por ingresso (Inteira / Meia)
      const valorBaseSessao = selectedSessao.valorIngresso ?? 0;
      const valorPorIngresso = tipoIngresso === 'MEIA' ? valorBaseSessao / 2 : valorBaseSessao;

      // 1. Cria todos os ingressos salvando o valor calculado
      const promessasIngressos = assentosSelecionados.map(assento => 
        ingressosService.create({
          sessaoId: selectedSessao.id,
          tipo: tipoIngresso,
          valor: valorPorIngresso, 
          assento: assento
        })
      );

      const novosIngressos = await Promise.all(promessasIngressos);
      const ingressosIds = novosIngressos.map(ing => Number(ing.id));
      const lanchesIds: number[] = lancheSelecionadoId ? [lancheSelecionadoId] : [];
      
      // 2. Calcula o valor total local apenas para fins de exibição no Recibo
      const totalIngressos = assentosSelecionados.length * valorPorIngresso;
      const lancheEscolhido = combosDisponiveis.find(c => c.id === lancheSelecionadoId);
      const totalLanche = lancheEscolhido ? (lancheEscolhido.preco ?? (lancheEscolhido as any).valorUnitario ?? 0) : 0;
      const valorTotalCalculado = totalIngressos + totalLanche;

      // 3. Cria o pedido enviando APENAS o que o seu CreatePedidoDTO aceita
      const pedidoRealizado = await pedidosService.create({
        ingressosIds,
        lanchesIds
        // 👈 Removido o valorTotal daqui para sanar o erro do TypeScript!
      });

      // 4. Injeta o valor calculado direto no estado local para renderizar sem NaN no Modal de Recibo
      if (pedidoRealizado) {
        pedidoRealizado.valorTotal = valorTotalCalculado;
      }

      setUltimoPedidoCriado(pedidoRealizado);
      setLancheModalVisible(false);
      setReciboModalVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível processar a compra unificada.');
    } finally { setLoading(false); }
  }

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#E50914" /></View>;
  if (!filme) return <View style={styles.loadingContainer}><Text style={{ color: '#999', fontSize: 16 }}>Filme não encontrado</Text></View>;

  const nomeGenero = typeof filme.genero === 'object' ? (filme.genero as any)?.nome : filme.genero;
  const classificacaoTexto = (filme as any).classificacao || filme.classificacaoEtaria;

  const valorOriginalIngresso = selectedSessao?.valorIngresso ?? 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (router.canGoBack()) { router.back(); } else { router.replace('/(tabs)'); } }}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.movieHero}>
        <View style={styles.movieIconLarge}><Ionicons name="videocam" size={48} color="#E50914" /></View>
        <Text style={styles.movieTitle}>{filme.titulo}</Text>
        <Text style={styles.movieGenre}>{nomeGenero}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Classificação</Text>
          <Text style={styles.infoValue}>{classificacaoTexto}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duração</Text>
          <Text style={styles.infoValue}>{filme.duracao} minutos</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Período</Text>
          <Text style={styles.infoValue}>{formatDate(filme.dataInicioExibicao)} - {formatDate(filme.dataFinalExibicao)}</Text>
        </View>
      </View>
      
      <View style={styles.sinopseSection}>
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.sinopseText}>{filme.sinopse || 'Sinopse não disponível.'}</Text>
      </View>
      
      {/* SEÇÃO SESSÕES */}
      <View style={styles.sessoesSection}>
        <View style={styles.sessoesHeaderRow}>
          <Text style={styles.sectionTitle}>Sessões Disponíveis</Text>
          <TouchableOpacity style={styles.addSessaoBtn} onPress={handleOpenCreateSessao}>
            <Ionicons name="add-circle-outline" size={18} color="#E50914" />
            <Text style={styles.addSessaoBtnText}>Sessão</Text>
          </TouchableOpacity>
        </View>

        {sessoes.length === 0 ? (
          <Text style={{ color: '#666', fontSize: 14, textAlign: 'center', marginTop: 20 }}>Nenhuma sessão disponível</Text>
        ) : (
          sessoes.map((sessao: any) => {
            const dataSessao = sessao.horario || (sessao as any).horarioInicio;
            const preco = sessao.valorIngresso ?? 20.00;
            return (
              <View key={sessao.id} style={styles.sessaoCardContainer}>
                <TouchableOpacity style={styles.sessaoCard} onPress={() => handleAbrirCompra(sessao)}>
                  <View style={styles.sessaoInfo}>
                    <Text style={{ color: '#999', fontSize: 13 }}>{formatDate(dataSessao)}</Text>
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{formatTime(dataSessao)}</Text>
                    <Text style={{ color: '#999', fontSize: 13 }}>Sala {sessao.sala?.numero || sessao.salaId}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6, marginRight: 8 }}>
                    <Text style={{ color: '#E50914', fontSize: 16, fontWeight: 'bold' }}>R$ {preco.toFixed(2)}</Text>
                    <Text style={styles.comprarTag}>Comprar</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.sessaoAdminActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenEditSessao(sessao)}>
                    <Ionicons name="pencil" size={16} color="#FFC107" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteSessao(sessao.id)}>
                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* MODAL CONFIGURAÇÃO ADMIN */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingSessaoId ? 'Editar Sessão' : 'Nova Sessão'}</Text>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 14 }}>
              <Text style={styles.inputLabel}>ID da Sala</Text>
              <TextInput style={styles.input} value={salaId} onChangeText={setSalaId} keyboardType="numeric" placeholder="Ex: 1" placeholderTextColor="#666" />
              <Text style={styles.inputLabel}>Horário (DD/MM/AAAA HH:MM)</Text>
              <TextInput style={styles.input} value={dataHora} onChangeText={setDataHora} placeholder="Ex: 02/06/2026 21:00" placeholderTextColor="#666" />
              <Text style={styles.inputLabel}>Preço (R$)</Text>
              <TextInput style={styles.input} value={valorIngresso} onChangeText={setValorIngresso} keyboardType="numeric" placeholder="25.00" placeholderTextColor="#666" />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={handleSaveSessao}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CLIENTE 1: MAPA DE ASSENTOS */}
      <Modal visible={compraModalVisible} animationType="slide" transparent={true} onRequestClose={() => setCompraModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <Text style={styles.modalTitle}>Mapa de Assentos</Text>
            
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
              <View style={styles.cinemaTela}><Text style={styles.cinemaTelaText}>TELA DO CINEMA</Text></View>

              <View style={styles.gridAssentos}>
                {fileiras.map((fileira) => (
                  <View key={fileira} style={styles.fileiraRow}>
                    <Text style={styles.fileiraLetra}>{fileira}</Text>
                    {colunas.map((coluna) => {
                      const nomeAssento = `${fileira}${coluna}`;
                      const estaOcupado = assentosOcupados.includes(nomeAssento);
                      const estaSelecionado = assentosSelecionados.includes(nomeAssento);

                      return (
                        <TouchableOpacity
                          key={nomeAssento}
                          disabled={estaOcupado}
                          style={[
                            styles.assentoBotao,
                            estaOcupado && styles.assentoOcupado,
                            estaSelecionado && styles.assentoSelecionado
                          ]}
                          onPress={() => handleSelectAssento(nomeAssento)}
                        >
                          <Text style={styles.assentoTexto}>{coluna}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={styles.legendaContainer}>
                <View style={styles.legendaItemVisible}><View style={[styles.legendaCor, { backgroundColor: '#333' }]} /><Text style={styles.legendaText}>Livre</Text></View>
                <View style={styles.legendaItemVisible}><View style={[styles.legendaCor, { backgroundColor: '#4CAF50' }]} /><Text style={styles.legendaText}>Selecionado</Text></View>
                <View style={styles.legendaItemVisible}><View style={[styles.legendaCor, { backgroundColor: '#E50914' }]} /><Text style={styles.legendaText}>Ocupado</Text></View>
              </View>

              <View style={{ width: '100%', height: 1, backgroundColor: '#333', marginVertical: 20 }} />

              {/* 👇 3. SUBSTITUIÇÃO DO TEXTINPUT PELO SELETOR DE ABAS DO TIPO DE INGRESSO */}
              <Text style={styles.inputLabel}>Tipo de Ingresso</Text>
              <View style={styles.selectorContainer}>
                <TouchableOpacity 
                  style={[styles.selectorButton, tipoIngresso === 'INTEIRA' && styles.selectorActive]} 
                  onPress={() => setTipoIngresso('INTEIRA')}
                >
                  <Ionicons name="ticket" size={16} color={tipoIngresso === 'INTEIRA' ? '#FFF' : '#666'} />
                  <Text style={[styles.selectorText, tipoIngresso === 'INTEIRA' && styles.selectorTextActive]}>
                    Inteira (R$ {Number(valorOriginalIngresso).toFixed(2)})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.selectorButton, tipoIngresso === 'MEIA' && styles.selectorActive]} 
                  onPress={() => setTipoIngresso('MEIA')}
                >
                  <Ionicons name="school" size={16} color={tipoIngresso === 'MEIA' ? '#FFF' : '#666'} />
                  <Text style={[styles.selectorText, tipoIngresso === 'MEIA' && styles.selectorTextActive]}>
                    Meia (R$ {Number(valorOriginalIngresso / 2).toFixed(2)})
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setCompraModalVisible(false)}><Text style={styles.btnText}>Voltar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={handleAvancarParaLanches}>
                <Text style={styles.btnText}>Avançar ({assentosSelecionados.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CLIENTE 2: BOMBONIERE */}
      <Modal visible={lancheModalVisible} animationType="slide" transparent={true} onRequestClose={() => setLancheModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Ionicons name="fast-food-outline" size={32} color="#FFC107" style={{ marginBottom: 8 }} />
            <Text style={styles.modalTitle}>Bomboniere</Text>
            <Text style={{ color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
              Deseja adicionar algum lanche ou combo para acompanhar o filme?
            </Text>

            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 10 }}>
              {combosDisponiveis.map((combo) => {
                // 👇 4. CORREÇÃO DEFINITIVA DO PREÇO DO LANCHE (Mata o NaN do modal de compra)
                const precoLancheReal = combo.preco ?? (combo as any).valorUnitario ?? 0;

                return (
                  <TouchableOpacity 
                    key={combo.id} 
                    style={[styles.comboOption, lancheSelecionadoId === combo.id && styles.comboOptionSelected]}
                    onPress={() => setLancheSelecionadoId(lancheSelecionadoId === combo.id ? null : combo.id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{combo.nome}</Text>
                      <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{combo.descricao}</Text>
                    </View>
                    <Text style={{ color: '#FFC107', fontWeight: 'bold' }}>R$ {Number(precoLancheReal).toFixed(2)}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => { setLancheModalVisible(false); setCompraModalVisible(true); }}>
                <Text style={styles.btnText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave, { backgroundColor: '#4CAF50' }]} onPress={handleFinalizarPedido}>
                <Text style={styles.btnText}>Pagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CLIENTE 3: RECIBO */}
      <Modal visible={reciboModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: '#4CAF50' }]}>
            <Ionicons name="checkmark-circle" size={54} color="#4CAF50" style={{ marginBottom: 10 }} />
            <Text style={[styles.modalTitle, { color: '#4CAF50' }]}>Pagamento Confirmado!</Text>
            {ultimoPedidoCriado && (
              <View style={styles.reciboBox}>
                <Text style={styles.reciboText}>Código do Pedido: <Text style={{fontWeight:'bold'}}>#{ultimoPedidoCriado.id}</Text></Text>
                <Text style={styles.reciboText}>Data da Compra: {ultimoPedidoCriado.dataHora ? formatDate(ultimoPedidoCriado.dataHora) : ''}</Text>
                <View style={{ height: 1, backgroundColor: '#333', marginVertical: 10 }} />
                <Text style={styles.reciboText}>Assentos Reservados: {assentosSelecionados.join(', ')}</Text>
                <Text style={[styles.reciboText, {color: '#4CAF50', fontWeight:'bold', marginTop: 10}]}>Total Debitado: R$ {Number(ultimoPedidoCriado.valorTotal).toFixed(2)}</Text>
              </View>
            )}
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#4CAF50', width: '100%', marginTop: 20 }]} onPress={() => setReciboModalVisible(false)}>
              <Text style={styles.btnText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  loadingContainer: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  movieHero: { alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#222' },
  movieIconLarge: { width: 100, height: 100, backgroundColor: '#1A1A1A', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  movieTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  movieGenre: { fontSize: 16, color: '#999' },
  infoSection: { padding: 24, gap: 12, width: '100%', alignSelf: 'stretch' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  infoLabel: { color: '#999', fontSize: 14 },
  infoValue: { color: '#FFF', fontSize: 14, fontWeight: '500', textAlign: 'right', minWidth: 50 },
  sinopseSection: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  sinopseText: { color: '#CCC', fontSize: 14, lineHeight: 22 },
  sessoesSection: { paddingHorizontal: 24, paddingBottom: 60 },
  sessoesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  addSessaoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  addSessaoBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  sessaoCardContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  sessaoCard: { flex: 1, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessaoInfo: { gap: 4 },
  comprarTag: { color: '#FFF', backgroundColor: '#E50914', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  sessaoAdminActions: { width: 44, backgroundColor: '#222', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 6, borderLeftWidth: 1, borderLeftColor: '#333' },
  actionBtn: { padding: 6 },
  
  cinemaTela: { backgroundColor: '#333', width: '85%', paddingVertical: 6, borderRadius: 4, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#555' },
  cinemaTelaText: { color: '#888', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
  gridAssentos: { gap: 10, width: '100%', paddingHorizontal: 10, alignItems: 'center' },
  fileiraRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fileiraLetra: { color: '#666', fontWeight: 'bold', width: 16, fontSize: 14, textAlign: 'center' },
  assentoBotao: { width: 34, height: 34, backgroundColor: '#333', borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  assentoOcupado: { backgroundColor: '#E50914', borderColor: '#b0060e' },
  assentoSelecionado: { backgroundColor: '#4CAF50', borderColor: '#388E3C' },
  assentoTexto: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  legendaContainer: { flexDirection: 'row', gap: 16, marginTop: 16, justifyContent: 'center', marginBottom: 10 },
  legendaItemVisible: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaCor: { width: 14, height: 14, borderRadius: 4 },
  legendaText: { color: '#aaa', fontSize: 12 },

  // Base de Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  inputLabel: { color: '#AAA', fontSize: 13, marginBottom: 6, alignSelf: 'flex-start', marginTop: 10 },
  input: { backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFF', fontSize: 15, width: '100%', marginBottom: 10 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#444' },
  btnSave: { backgroundColor: '#E50914' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  comboOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2a2a2a', padding: 12, borderRadius: 8, width: '100%', marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  comboOptionSelected: { borderColor: '#E50914', backgroundColor: '#3a1a1a' },
  reciboBox: { backgroundColor: '#141414', padding: 16, borderRadius: 8, width: '100%', marginTop: 14 },
  reciboText: { color: '#ccc', fontSize: 14, marginVertical: 2 },

  // 👇 5. NOVOS ESTILOS DO SELETOR DE INGRESSOS INTEGRADOS AQUI
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    marginBottom: 10,
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 6,
  },
  selectorActive: {
    backgroundColor: '#E50914',
  },
  selectorText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  selectorTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});