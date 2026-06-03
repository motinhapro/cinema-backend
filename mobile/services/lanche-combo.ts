import api from './api';
import { LancheCombo } from '../types';

export const lancheComboService = {
  // GET /lanche-combo
  async findAll(): Promise<LancheCombo[]> {
    const { data } = await api.get<LancheCombo[]>('/lanche-combo');
    return data;
  },

  // POST /lanche-combo
  async create(lancheData: { nome: string; descricao: string; valorUnitario: number }): Promise<LancheCombo> {
    const { data } = await api.post<LancheCombo>('/lanche-combo', lancheData);
    return data;
  },

  // PATCH /lanche-combo/:id
  async update(id: number | string, lancheData: { nome: string; descricao: string; valorUnitario: number }): Promise<LancheCombo> {
    const { data } = await api.patch<LancheCombo>(`/lanche-combo/${id}`, lancheData);
    return data;
  },

  // DELETE /lanche-combo/:id
  async remove(id: number | string): Promise<any> {
    const { data } = await api.delete(`/lanche-combo/${id}`);
    return data;
  }
};