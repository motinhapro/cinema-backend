import api from './api';
import { User, UpdateUserDTO } from '../types';

export const usersService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async updateProfile(dto: UpdateUserDTO): Promise<User> {
    const { data } = await api.patch<User>('/users/me', dto);
    return data;
  },

  async deleteProfile(): Promise<{ message: string }> {
    const { data } = await api.delete('/users/me');
    return data;
  },
};