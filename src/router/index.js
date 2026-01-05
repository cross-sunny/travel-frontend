import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    // 前台布局（包含首页）
    {
        path: '/',
        component: () => import('@/layout/FrontLayout.vue'),
        children: [
            { path: '', redirect: '/login' } // 首页默认重定向到登录页
        ]
    },
    // 独立的登录页
    {
        path: '/login',
        component: () => import('@/views/Login.vue')
    },
    // 独立的注册页
    {
        path: '/register',
        component: () => import('@/views/Register.vue')
    },
    // 后台布局（用户管理）
    {
        path: '/admin',
        component: () => import('@/layout/AdminLayout.vue'),
        children: [
            { path: 'user', component: () => import('@/views/admin/UserManage.vue') }
        ]
    },
    // 404页面（可选，路由匹配不到时跳转到登录页）
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router