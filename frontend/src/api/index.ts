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
        console.log('Request headers:', config.headers);
        console.log('Telegram user data:', telegramUser);
    } else {
        console.error('No telegram user data available. WebApp.initDataUnsafe:', WebApp.initDataUnsafe);
    }
    
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

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

function validateDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
}

export const userApi = {
    getCurrentUser: async (): Promise<UserResponse> => {
        console.log('Fetching current user...');
        const response = await api.get<UserResponse>('/api/users/me');
        return response.data;
    },
    
    updateBirthday: async (birthday: Date): Promise<UserResponse> => {
        if (!validateDate(birthday)) {
            throw new Error('Invalid date provided');
        }
        
        const formattedDate = birthday.toISOString().split('T')[0];
        const requestData = {
            birthday: formattedDate
        };
        
        console.log('Sending birthday update:', {
            url: '/api/users/me/birthday',
            method: 'PUT',
            data: requestData,
            headers: api.defaults.headers
        });
        
        const response = await api.put<UserResponse>('/api/users/me/birthday', requestData);
        
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