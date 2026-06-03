import api from './api';
import { Sessao } from '../types';

export const sessoesService = {
  async findAll(): Promise<Sessao[]> {
    const { data } = await api.get<Sessao[]>('/sessoes');
    return data;
  },

  async findOne(id: string | number): Promise<Sessao> {
    const { data } = await api.get<Sessao>(`/sessoes/${id}`);
    return data;
  },

  async create(sessaoData: { filmeId: number; salaId: number; horario: string; valorIngresso: number }): Promise<any> {
    const { data } = await api.post('/sessoes', sessaoData);
    return data;
  },

  async update(
    id: string | number, 
    sessaoData: { horarioInicio: string; filmeId?: number; salaId?: number; valorIngresso?: number }
  ): Promise<any> {
    const { data } = await api.patch(`/sessoes/${id}`, sessaoData);
    return data;
  },

  // Remover Sessão (DELETE /sessoes/:id)
  async remove(id: string | number): Promise<any> {
    const { data } = await api.delete(`/sessoes/${id}`);
    return data;
  },
};