interface User {
    _id: string;
    email: string;
    role: string;
    plan: string;
    apiKeyUses: number;
    apiUsage: number;
    planExpiry?: string;
}

import { defineStore } from 'pinia';
import axios from 'axios';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        stats: { users: 0, memories: 0, agentLogs: 0 },
        users: [] as User[],
        memories: [] as any[],
        logs: [] as any[],
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchStats() {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.stats = res.data;
            } catch (err: any) {
                console.error(err);
            }
        },
        async fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.users = res.data;
            } catch (err: any) {
                console.error(err);
            }
        },
        async fetchMemories() {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/memory', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.memories = res.data;
            } catch (err: any) {
                console.error(err);
            }
        },
        async addMemory(prompt: string, response: string) {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/admin/memory', { prompt, response }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await this.fetchMemories(); // Refresh
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.msg || 'Failed to add memory';
                return false;
            }
        },
        async deleteMemory(id: string) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/memory/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await this.fetchMemories(); // Refresh
            } catch (err: any) {
                console.error(err);
            }
        },
        async updateUserExpiry(id: string, date: string) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/admin/users/${id}/expiry`, { date }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await this.fetchUsers(); // Refresh list
                return true;
            } catch (err: any) {
                console.error(err);
                return false;
            }
        },
        async autoImportMemory(content: string, count: number = 10) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post('http://localhost:5000/api/admin/memory/auto', { content, count }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await this.fetchMemories();
                return res.data.msg;
            } catch (err: any) {
                this.error = err.response?.data?.msg || 'Import failed';
                return false;
            }
        }
    }
});
