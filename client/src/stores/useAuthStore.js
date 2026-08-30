import { create } from 'zustand';
import { loginService, registerService, guestLoginRequest } from '../api/auth.service';

const safeParse = (key) => {
    try {
        const val = localStorage.getItem(key);
        if (val && val !== 'undefined') return JSON.parse(val);
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage:`, e);
    }
    return null;
};

const initialUser = safeParse('user');
const initialToken = localStorage.getItem('token') || null;

export const useAuthStore = create((set) => ({
    user: initialUser,
    token: initialToken,
    // Derived state consumed by ProtectedRoute, PublicRoute, Layout
    isAuthenticated: !!initialToken && !!initialUser,
    role: initialUser?.role || null,
    isAuthChecked: false,
    isLoading: false,
    isGuestLoggedIn: false,
    error: null,

    rehydrate: () => {
        const token = localStorage.getItem('token');
        const user = safeParse('user');

        if (token && user) {
            set({ token, user, isAuthenticated: true, role: user.role, isAuthChecked: true });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ token: null, user: null, isAuthenticated: false, role: null, isAuthChecked: true });
        }
    },

    clearError: () => set({ error: null }),

    // Used by Register.jsx (mirrors the old useAppStore.setCredentials)
    setCredentials: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, role: user.role, isLoading: false, isAuthChecked: true });
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const data = await loginService(credentials);
            if (data && data.user && data.token) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                set({
                    user: data.user, token: data.token,
                    isAuthenticated: true, role: data.user.role,
                    isLoading: false, isAuthChecked: true
                });
            }
            return true;
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

    guestLogin: async () => {
        set({ isGuestLoggedIn: true, error: null });
        try {
            const data = await guestLoginRequest();
            if (data && data.user && data.token) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                set({
                    user: data.user, token: data.token,
                    isAuthenticated: true, role: data.user.role,
                    isGuestLoggedIn: false, isAuthChecked: true
                });
            }
            return true;
        } catch (err) {
            let errorMessage = 'An error occurred during guest login.';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            set({ error: errorMessage, isGuestLoggedIn: false });
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, role: null, error: null, isAuthChecked: true });
    }
}));

