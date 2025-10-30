import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = 'https://reflexoperu-v3.marketingmedico.vip/backend/public/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterData {
  document_number: string;
  name: string;
  paternal_lastname: string;
  maternal_lastname: string;
  email: string;
  phone: string;
  user_name: string;
  password: string;
  last_session: string;
  account_statement: boolean;
  document_type_id: number;
  country_id: number;
}

export interface LoginResponse {
  first_login: boolean;
  message: string;
  token: string;
  role: number;
}

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  user_name: string;
  phone: string;
  role: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
  };
}

export const authService = {
  register: async (data: RegisterData): Promise<any> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/profile');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.delete('/logout');
  },
};
