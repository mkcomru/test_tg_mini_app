import axios from 'axios';
import { WebApp } from '../telegram';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const telegramUser = WebApp.initDataUnsafe.user;
    
    if (telegramUser && telegramUser.id && config.headers) {
        config.headers['telegram_id'] = telegramUser.id.toString();
    }
    
    return config;
});

export interface UserResponse {
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    birthday?: string;
    birthday_remaining?: {
        days: number;
        hours: number;
        minutes: number;
    };
}

export interface BirthdayUpdateRequest {
    birthday: string; 
}

export const userApi = {
    getCurrentUser: async (): Promise<UserResponse> => {
        const response = await api.get<UserResponse>('/users/me');
        return response.data;
    },
    
    updateBirthday: async (birthday: Date): Promise<UserResponse> => {
        const formattedDate = birthday.toISOString().split('T')[0];
        
        const response = await api.put<UserResponse>('/users/me/birthday', {
            birthday: formattedDate
        });
        
        return response.data;
    }
};

export const shareApi = {
    getSharedData: async (shareCode: string): Promise<UserResponse> => {
        const response = await api.get<{user: UserResponse, is_expired: boolean}>(`/share/${shareCode}`);
        return response.data.user;
    },
    
    createShareLink: async (): Promise<string> => {
        const response = await api.post<{share_code: string, expires_at?: string}>('/share', {
            expires_in_hours: 24
        });
        return response.data.share_code;
    }
};

export default api;