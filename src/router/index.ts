import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';
import UserDashboard from '../views/user/UserDashboard.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import AdminUser from '../views/admin/AdminUser.vue';
import Pricing from '../views/Pricing.vue';
import PaymentCallback from '../views/PaymentCallback.vue';
import Home from '../views/Home.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/pricing', component: Pricing },
    { path: '/payment/callback', component: PaymentCallback },
    {
        path: '/user',
        component: () => import('../layouts/UserLayout.vue'), // Lazy load layout if needed, or just standard
        children: [
            { path: 'dashboard', component: UserDashboard },
            { path: 'chat', component: () => import('../views/user/Chat.vue') },
            { path: 'agent', component: () => import('../views/user/Agent.vue') }
        ]
    },
    {
        path: '/admin',
        component: () => import('../layouts/AdminLayout.vue'),
        children: [
            { path: 'dashboard', component: AdminDashboard },
            { path: 'users', component: AdminUser }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    const publicPages = ['/', '/login', '/register', '/pricing']; // payment/callback?
    const authRequired = !publicPages.includes(to.path) && !to.path.startsWith('/payment/callback');
    const loggedIn = localStorage.getItem('token');

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
});

export default router;
