import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
    // ===== 前台布局（所有面向用户的页面）=====
    {
        path: '/',
        component: () => import('@/layout/FrontLayout.vue'),
        children: [
            { path: '', component: () => import('@/views/Home.vue') }, // 首页

            // 1. 景点模块
            { path: 'scenic', component: () => import('@/views/Scenic.vue') }, // 景点列表
            { path: 'scenic/:id', component: () => import('@/views/ScenicDetail.vue') }, // 景点详情

            // 2. 民宿/酒店模块
            { path: 'hotel', component: () => import('@/views/Hotel.vue') }, // 民宿列表
            { path: 'hotel/:id', component: () => import('@/views/HotelDetail.vue') }, // 民宿详情

            // 3. 美食/特产模块 (新增)
            { path: 'food', component: () => import('@/views/Food.vue') }, // 美食列表
            { path: 'food/:id', component: () => import('@/views/FoodDetail.vue') }, // 美食详情

            // 4. 个人中心
            { path: 'user-center', component: () => import('@/views/UserCenter.vue') }
        ]
    },

    // ===== 认证页面（独立，无布局）=====
    {
        path: '/login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        component: () => import('@/views/Register.vue')
    },

    // ===== 后台管理布局 =====
    {
        path: '/admin',
        component: () => import('@/layout/AdminLayout.vue'),
        // 路由守卫：只有管理员才能进
        beforeEnter: (to, from, next) => {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            if (user.role === 'ADMIN') {
                next()
            } else {
                ElMessage.error('无权访问后台，请使用管理员账号登录')
                next('/')
            }
        },
        children: [
            // 仪表盘
            { path: 'dashboard', component: () => import('@/views/admin/Dashboard.vue') },
            // 各个管理模块
            { path: 'user', component: () => import('@/views/admin/UserManage.vue') },
            { path: 'scenic', component: () => import('@/views/admin/ScenicManage.vue') },
            { path: 'hotel', component: () => import('@/views/admin/HotelManage.vue') },
            { path: 'food', component: () => import('@/views/admin/FoodManage.vue') }, // 新增美食管理
            { path: 'order', component: () => import('@/views/admin/OrderManage.vue') }
        ]
    },

    // ===== 404 重定向 =====
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局路由守卫（防止未登录访问个人中心）
router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    // 如果要去个人中心，且没登录
    if (to.path === '/user-center' && !user.id) {
        ElMessage.warning('请先登录')
        next('/login')
    } else {
        next()
    }
})

export default router