export interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Filme {
  id: string;
  titulo: string;
  sinopse: string;
  classificacaoEtaria: string;
  duracao: number;
  genero: {
    id: number;
    nome: string;
  };
  dataInicioExibicao: string;
  dataFinalExibicao: string;
}

export interface Genero {
  id: number;
  nome: string;
}

export interface Sala {
  id: number;
  numero: number;
  capacidade: number;
}

export interface Sessao {
  id: number;
  filmeId: number;
  salaId: number;
  horarioInicio: string;
  valorIngresso: number;
  filme?: Filme;
  sala?: Sala;
}

export interface Ingresso {
  id: number;
  sessaoId: number;
  tipo: string;
  valorPago: number;
  assento: string;
  sessao?: Sessao;
}

export interface LancheCombo {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export interface Pedido {
  id: number;
  valorTotal: number;
  dataHora: string;
}

export interface CreateIngressoDTO {
  sessaoId: number;
  tipo: string;
  valor: number;
  assento: string;
}

export interface CreatePedidoDTO {
  ingressosIds?: number[];
  lanchesIds?: number[];
}

export interface UpdateUserDTO {
  nome?: string;
  telefone?: string;
  senha?: string;
}