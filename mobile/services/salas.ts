import api from './api';

export interface SalaData {
  id: string;
  numero: number;
  capacidade: number;
}

export const salasService = {
  async findAll(): Promise<SalaData[]> {
    const { data } = await api.get<SalaData[]>('/salas');
    return data;
  },

  async findOne(id: string): Promise<SalaData> {
    const { data } = await api.get<SalaData>(`/salas/${id}`);
    return data;
  },

  async create(salaData: { numero: number; capacidade: number }): Promise<SalaData> {
    const { data } = await api.post<SalaData>('/salas', salaData);
    return data;
  },

  async update(id: string, salaData: { numero?: number; capacidade?: number }): Promise<SalaData> {
    const { data } = await api.patch<SalaData>(`/salas/${id}`, salaData);
    return data;
  },

  async remove(id: string): Promise<any> {
    const { data } = await api.delete(`/salas/${id}`);
    return data;
  },
};