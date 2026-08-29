import { create } from 'zustand';
import { loginService, registerService } from '../api/auth.service';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthChecked: false,
    isLoading: false,
    error: null,

    rehydrate: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        set({ token, user, isAuthChecked: true });
    },

    clearError: () => set({ error: null }),

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const data = await loginService(credentials);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isLoading: false, isAuthChecked: true });
            return data;
        } catch (err) {
            let errorMessage = 'An error occurred during login.';
            if (err.response?.data?.errors) {
                errorMessage = err.response.data.errors[0].message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, error: null });
    }
}));
