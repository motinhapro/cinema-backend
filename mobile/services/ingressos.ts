import api from './api';
import { Ingresso, CreateIngressoDTO } from '../types';

export const ingressosService = {
  async create(ingressoData: CreateIngressoDTO): Promise<Ingresso> {
    const { data } = await api.post<Ingresso>('/ingressos', ingressoData);
    return data;
  },
  async findAll(sessaoId?: number): Promise<Ingresso[]> {
    const url = sessaoId ? `/ingressos?sessaoId=${sessaoId}` : '/ingressos';
    const { data } = await api.get<Ingresso[]>(url);
    return data;
  }
};