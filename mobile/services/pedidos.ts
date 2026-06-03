import api from './api';
import { Pedido, CreatePedidoDTO } from '../types';

export const pedidosService = {
  async create(pedidoData: CreatePedidoDTO): Promise<Pedido> {
    const { data } = await api.post<Pedido>('/pedidos', pedidoData);
    return data;
  },
  async findAll(): Promise<Pedido[]> {
    const { data } = await api.get<Pedido[]>('/pedidos');
    return data;
  }
};