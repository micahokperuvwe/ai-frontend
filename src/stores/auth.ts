import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: localStorage.getItem('token') || null as string | null,
        loading: false,
        error: null as string | null
    }),
    actions: {
        async login(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post(//'http://localhost:5000/api/auth/login',
                     'https://ai-backend-90ak.onrender.com/api/auth/login', { email, password });
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token || '');
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.msg || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },
        async register(name: string, email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                await axios.post(//'http://localhost:5000/api/auth/register',
                    'https://ai-backend-90ak.onrender.com/api/auth/register', { name, email, password });
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.msg || 'Registration failed';
                return false;
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            // Redirect handled by component or router guard
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    }
});
