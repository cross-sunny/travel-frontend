# 🌍 Traveler - 旅游服务平台前端

基于 **Vue 3 + Vite + Element Plus** 构建的前后端分离旅游服务平台前端系统。  
包含前台用户系统与后台管理系统。

---

## 🛠 技术栈

- Vue 3（Composition API）
- Vite
- Vue Router 4
- Element Plus
- Axios

---

## 🚀 快速启动

### 1. 克隆项目

### 2. 安装依赖
`npm install`

### 3. 配置后端接口地址

编辑文件：

src/utils/request.js

确认后端地址为：

http://localhost:8082

### 4. 启动项目
`npm run dev`

浏览器访问：

http://localhost:5173

### 4.🔑 测试说明

管理员账号：数据库内置账号，登录后可进入后台
账号：admin 密码：123456

普通用户：通过注册页使用真实邮箱获取验证码注册

### 5.📂 目录结构说明
src/
├── layout/
│   ├── FrontLayout.vue           # 前台通用布局：包含顶部导航栏（Logo、菜单、用户头像）、底部 Footer
│   └── AdminLayout.vue           # 后台管理布局：左侧侧边栏菜单 + 顶部面包屑导航，用于管理员界面
│
├── router/
│   └── index.js                  # 路由配置与守卫：定义页面跳转规则，设置登录拦截（防止未登录访问 admin 页面）
│
├── utils/
│   └── request.js                # Axios 请求封装：统一配置 base URL（支持本地/线上切换），全局处理 404/500 错误，拦截 token 过期
│
├── views/
│   ├── Home.vue                  # 首页：展示 3D 轮播图 + 景点/民宿/美食三大板块，支持随机数据渲染
│   ├── Login.vue                 # 登录页：极简透明毛玻璃设计，支持账号密码登录 + “忘记密码”重置功能
│   ├── Register.vue              # 注册页：邮箱注册流程，集成验证码发送逻辑（调用后端接口）
│   ├── UserCenter.vue            # 个人中心：查看订单、修改昵称、上传头像（本地文件上传）、注销账号
│   ├── Scenic.vue                # 景点列表页：分页展示所有景点，支持关键词搜索
│   ├── ScenicDetail.vue          # 景点详情页：展示大图、价格、简介，提供“立即预定”按钮生成订单
│   ├── Hotel.vue                 # 民宿列表页：分页展示所有民宿，支持关键词搜索
│   ├── HotelDetail.vue           # 民宿详情页：展示房间信息、价格、图片，支持预订
│   ├── Food.vue                  # 美食列表页：展示推荐美食，支持分类筛选与搜索
│   ├── FoodDetail.vue            # 美食详情页：展示菜品图片、价格、店家信息，支持下单
│   └── admin/
│       ├── Dashboard.vue         # 后台仪表盘：显示系统核心数据（用户数、交易额）、实时订单动态
│       ├── UserManage.vue        # 用户管理：查看所有用户，支持分页、搜索、删除违规用户
│       ├── OrderManage.vue       # 订单管理：审计平台全部订单记录，支持状态筛选与查看详情
│       ├── ScenicManage.vue      # 景点管理：增删改查景点信息，支持图片上传预览
│       ├── HotelManage.vue       # 民宿管理：增删改查民宿信息，支持多图上传
│       └── FoodManage.vue        # 美食管理：增删改查美食信息，含“店长推荐”开关控制
│
├── App.vue                       # 根组件：所有页面的容器，绑定路由视图
├── main.js                       # 入口文件：初始化 Vue 应用，引入 Element Plus、路由、全局样式
├── main.css                      # 全局 CSS 样式文件，包含自定义变量和基础样式
└── assets/
└── logo.png                  # 项目 Logo 图片资源（可选）

# 其他根目录文件
├── .gitignore                    # Git 忽略文件配置
├── index.html                    # HTML 入口模板
├── package.json                  # 项目依赖与脚本配置
├── package-lock.json             # 依赖锁定文件
├── README.md                     # 项目说明文档
└── vite.config.js                # Vite 构建配置文件