import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pedidosService } from '../../services/pedidos';

export default function MeusPedidosScreen() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPedidos() {
    try {
      setLoading(true);
      const data = await pedidosService.findAll();
      
      // 👇 LOG CRUCIAL: Abre o F12 ou o terminal do Expo para ver isso aqui!
      console.log('=== DATA REAL RECEBIDA DA API ===');
      console.log(JSON.stringify(data, null, 2));
      
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao buscar histórico de pedidos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPedidos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPedidos();
  };

  function formatDate(dataIso: string) {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR');
  }

  function formatTime(dataIso: string) {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#444" />
            <Text style={styles.emptyText}>Nenhum pedido localizado no seu histórico.</Text>
          </View>
        }
        renderItem={({ item }) => {
          // ─── TRATAMENTO DE MAPEAR RELACIONAMENTOS DO PRISMA ───
          
          // 1. Data do Pedido mapeia o 'dataHora' gerado pelo @default(now()) do Prisma
          const dataCompraReal = item.dataCompra ?? item.dataHora;

          // 2. Extrai o filme navegando pelo include: ingressos -> sessao -> filme
          const filmeTituloReal = 
            item.filmeTitulo ?? 
            item.ingressos?.[0]?.sessao?.filme?.titulo ?? 
            'Ingresso de Cinema';

          // 3. Extrai o horário da sessão do relacionamento
          const horarioSessaoReal = 
            item.horarioSessao ?? 
            item.ingressos?.[0]?.sessao?.horarioInicio;

          // 4. Mapeia o array de ingressos puxando apenas a string de assento de cada um
          const listaAssentos = 
            item.assentos ?? 
            item.ingressos?.map((ing: any) => ing.assento).filter(Boolean) ?? 
            [];

          // 5. Array de lanches populado pelo include do backend
          const listaLanches = item.lanches ?? [];

          return (
            <View style={styles.pedidoCard}>
              {/* Header do Card */}
              <View style={styles.pedidoHeader}>
                <View style={styles.row}>
                  <Ionicons name="receipt-outline" size={16} color="#E50914" />
                  <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                </View>
                <Text style={styles.pedidoData}>{formatDate(dataCompraReal)}</Text>
              </View>

              {/* Nome do Filme e Detalhes da Sessão */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.filmeTitle}>{filmeTituloReal}</Text>
                {horarioSessaoReal && (
                  <Text style={styles.sessaoTime}>
                    Sessão: {formatTime(horarioSessaoReal)}
                  </Text>
                )}
              </View>

              {/* Assentos Reservados Dinâmicos */}
              {listaAssentos.length > 0 && (
                <View style={styles.itemRow}>
                  <Ionicons name="ticket-outline" size={16} color="#E50914" />
                  <Text style={styles.itemText}>
                    Assento(s): <Text style={{ fontWeight: 'bold', color: '#FFF' }}>{listaAssentos.join(', ')}</Text>
                  </Text>
                </View>
              )}

              {/* Lista de Lanches Popula Dinamicamente */}
              {listaLanches.map((lanche: any, index: number) => {
                const qtd = lanche.quantidade ?? 1;
                return (
                  <View key={lanche.id || index} style={styles.itemRow}>
                    <Ionicons name="fast-food-outline" size={16} color="#FFC107" />
                    <Text style={styles.itemText}>
                      {qtd}x {lanche.nome}
                    </Text>
                  </View>
                );
              })}

              {/* Rodapé com Valor Consolidado */}
              <View style={styles.pedidoFooter}>
                <Text style={styles.totalLabel}>Total Consolidado:</Text>
                <Text style={styles.totalValor}>R$ {Number(item.valorTotal ?? 0).toFixed(2)}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  centerContainer: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  
  pedidoCard: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#262626' },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#262626', paddingBottom: 8, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pedidoId: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  pedidoData: { color: '#666', fontSize: 12 },
  
  filmeTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  sessaoTime: { color: '#999', fontSize: 13, marginTop: 2 },
  
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  itemText: { color: '#D4D4D4', fontSize: 14 },
  
  pedidoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#262626' },
  totalLabel: { color: '#999', fontSize: 13 },
  totalValor: { color: '#E50914', fontSize: 16, fontWeight: 'bold' },
  
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center' }
});