import api from './api';
import { Filme } from '../types';

export const filmesService = {
  async findAll(): Promise<Filme[]> {
    const { data } = await api.get<Filme[]>('/filmes');
    return data;
  },

  async findOne(id: string): Promise<Filme> {
    const { data } = await api.get<Filme>(`/filmes/${id}`);
    return data;
  },
  
  async create(filmeData: any): Promise<Filme> {
    const { data } = await api.post<Filme>('/filmes', filmeData);
    return data;
  },

  async update(id: string, filmeData: any): Promise<Filme> {
    const { data } = await api.patch<Filme>(`/filmes/${id}`, filmeData);
    return data;
  },

  async remove(id: string): Promise<any> {
    const { data } = await api.delete(`/filmes/${id}`);
    return data;
  },
};