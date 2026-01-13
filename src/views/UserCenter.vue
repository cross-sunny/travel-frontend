<template>
  <div class="user-center-container">
    <el-row :gutter="20">
      <!-- 左侧：个人信息卡片 -->
      <el-col :span="8">
        <el-card class="user-card">

          <!-- 1. 头像区域 -->
          <div class="avatar-container" @click="openAvatarEdit">
            <el-avatar :size="100" :src="getFullUrl(userInfo.avatar)" />
            <div class="edit-avatar">更换头像</div>
          </div>

          <!-- 2. 昵称与角色 (强制居中) -->
          <div class="info-header">
            <h2 class="user-nickname">{{ userInfo.nickname || userInfo.username }}</h2>
            <div class="role-tag-wrapper">
              <el-tag :type="userInfo.role === 'ADMIN' ? 'danger' : 'success'" effect="light" round>
                {{ userInfo.role === 'ADMIN' ? '管理员' : '普通用户' }}
              </el-tag>
            </div>
          </div>

          <el-divider class="custom-divider" />

          <!-- 3. 表单区域 (宽度与按钮统一) -->
          <el-form class="user-form" label-width="50px" label-position="left">
            <el-form-item label="账号">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>
            <el-form-item label="昵称">
              <!-- 增加 @blur 事件，失去焦点时触发保存 -->
              <el-input
                  v-model="editForm.nickname"
                  @blur="handleNicknameBlur"
                  placeholder="点击修改，失焦自动保存"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="editForm.email" disabled placeholder="不支持修改" />
            </el-form-item>
          </el-form>

          <!-- 4. 按钮组 -->
          <div class="button-group">
            <!-- 修改点：替换原来的保存按钮 -->
            <el-button
                color="#87CEEB"
                style="color: white; width: 100% !important; height: 40px; border-radius: 20px; margin-left: 0 !important;"
                @click="$router.push('/ai-recommend')"
            >
              <el-icon style="margin-right: 5px;"><MagicStick /></el-icon>
              AI 智能推荐
            </el-button>

            <el-button type="danger" plain class="action-btn" @click="deleteAccount">注销账号</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：我的订单 (保持不变) -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>📦 我的订单</h3>
            </div>
          </template>

          <el-table :data="orders" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="单号" width="80" />
            <el-table-column label="商品信息">
              <template #default="scope">
                <span style="font-weight: bold;">{{ scope.row.productName }}</span>
                <el-tag size="small" style="margin-left: 5px;" :type="scope.row.productType === 'SCENIC' ? 'success' : (scope.row.productType === 'FOOD' ? 'danger' : 'warning')">
                  {{ scope.row.productType === 'SCENIC' ? '景点' : (scope.row.productType === 'FOOD' ? '美食' : '民宿') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="金额" width="100">
              <template #default="scope">¥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="160">
              <template #default="scope">
                {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag effect="dark">已支付</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="orders.length === 0" description="暂无订单，快去下单吧！"></el-empty>
        </el-card>
      </el-col>
    </el-row>

    <!-- 头像上传弹窗 -->
    <el-dialog v-model="avatarDialogVisible" title="更换头像" width="400px" align="center">
      <div class="upload-container">
        <div class="dialog-avatar-wrap" @click="triggerUpload">
          <div v-if="isAvatarUploading" class="blue-loading">
            <el-icon class="loading-icon"><Loading /></el-icon>
          </div>
          <el-icon v-else class="dialog-upload-icon"><Upload /></el-icon>
          <img v-if="newAvatarUrl" :src="getFullUrl(newAvatarUrl)" class="dialog-avatar" />
          <img v-else :src="getFullUrl(userInfo.avatar)" class="dialog-avatar" />
        </div>
        <!-- 隐藏的upload组件，通过ref触发 -->
        <el-upload
            ref="uploadRef"
            class="hidden-upload"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleUploadProgress"
            name="file"
        />
      </div>

      <p style="font-size: 12px; color: #999; margin-top: 10px; text-align: center;">
        点击上方图片上传本地文件 (支持 JPG/PNG，小于2MB)
      </p>

      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAvatar">确定更换</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {Upload, Loading, MagicStick} from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref({})
const editForm = reactive({ nickname: '', email: '' })
const orders = ref([])
const loading = ref(false)

// 头像相关变量
const avatarDialogVisible = ref(false)
const newAvatarUrl = ref('')
const isAvatarUploading = ref(false)
const uploadRef = ref(null)

// 1. 定义服务器地址
const REMOTE_SERVER = 'https://zjyweb.asia'

// 2. 上传地址会自动变成 https://zjyweb.asia/travel/api/file/upload
const uploadUrl = `${REMOTE_SERVER}/travel/api/file/upload`

// 3. 图片路径补全
const getFullUrl = (url) => {
  if (!url) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  if (url.startsWith('http')) return url
  // 如果是相对路径，拼上 https 前缀
  if (url.startsWith('/files')) return `${REMOTE_SERVER}${url}`
  return url
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if(userStr) {
    userInfo.value = JSON.parse(userStr)
    editForm.nickname = userInfo.value.nickname
    editForm.email = userInfo.value.email
    loadOrders()
  } else {
    router.push('/login')
  }
})

const loadOrders = () => {
  loading.value = true
  request.get('/order/my', { params: { userId: userInfo.value.id } }).then(res => {
    orders.value = res
  }).finally(() => loading.value = false)
}
// 新增失焦处理函数
const handleNicknameBlur = () => {
  // 如果没变，或者为空，不发请求
  if (!editForm.nickname || editForm.nickname === userInfo.value.nickname) return

  updateInfo() // 复用之前的更新函数
}

// 修改原 updateInfo 函数，去掉 reload 刷新页面的逻辑（体验更好）
const updateInfo = () => {
  const data = {
    id: userInfo.value.id,
    nickname: editForm.nickname
  }
  request.post('/user/update', data).then(res => {
    ElMessage.success('昵称已更新')
    userInfo.value = res
    localStorage.setItem('user', JSON.stringify(res))
  })
}

const openAvatarEdit = () => {
  newAvatarUrl.value = ''
  avatarDialogVisible.value = true
}

// 触发隐藏的文件选择框
const triggerUpload = () => {
  // 核心：模拟点击 el-upload 内部的 input
  uploadRef.value.$el.querySelector('input').click()
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleUploadProgress = () => {
  isAvatarUploading.value = true
}

const handleAvatarSuccess = (response, uploadFile) => {
  isAvatarUploading.value = false
  if (response.code === '200') {
    newAvatarUrl.value = response.data
    ElMessage.success('上传成功，请点击确定更换')
  } else {
    ElMessage.error('上传业务失败: ' + response.msg)
  }
}

const handleAvatarError = (err) => {
  isAvatarUploading.value = false
  console.error('上传报错:', err)
  ElMessage.error('上传请求失败，请检查网络')
}

const saveAvatar = () => {
  if (!newAvatarUrl.value) {
    avatarDialogVisible.value = false
    return
  }
  const data = {
    id: userInfo.value.id,
    avatar: newAvatarUrl.value
  }
  request.post('/user/update', data).then(res => {
    ElMessage.success('头像更换成功')
    userInfo.value = res
    localStorage.setItem('user', JSON.stringify(res))
    avatarDialogVisible.value = false
    setTimeout(() => location.reload(), 500)
  })
}

const deleteAccount = () => {
  ElMessageBox.confirm(
      '注销后无法恢复。确定要注销吗？',
      '危险操作警告',
      { confirmButtonText: '确定注销', cancelButtonText: '取消', type: 'error' }
  ).then(() => {
    request.delete('/user/delete-self/' + userInfo.value.id).then(() => {
      ElMessage.success('账号已注销')
      localStorage.removeItem('user')
      router.push('/login')
    })
  })
}
</script>

<style scoped>
/* 左侧卡片布局 */
.user-card {
  display: flex;
  flex-direction: column;
  align-items: center; /* 确保所有子元素水平居中 */
  padding: 40px 20px;
  min-height: 520px;
}

/* 1. 头像区域 (确保无偏移) */
.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px; /* margin: 0 auto 是块级元素居中的关键 */
  cursor: pointer;
  display: flex;       /* 增加 Flex 确保图片在容器内也居中 */
  justify-content: center;
  align-items: center;
}
.edit-avatar {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; opacity: 0; transition: opacity 0.3s;
}
.avatar-container:hover .edit-avatar { opacity: 1; }

/* 2. 昵称与标签 */
.info-header {
  text-align: center;
  width: 100%;
  margin-bottom: 5px;
}
.user-nickname {
  margin: 0 0 10px 0;
  font-size: 22px;
  color: #303133;
}
.role-tag-wrapper {
  display: flex;
  justify-content: center;
}

/* 3. 分割线 (核心修改) */
.custom-divider {
  margin: 25px 0;
  /* 修改宽度为 260px，与下面的表单(.user-form)宽度严格一致 */
  width: 260px !important;
  /* 确保分割线本身也是居中的 */
  align-self: center;
}

/* 4. 表单样式 (宽度基准) */
.user-form {
  width: 260px; /* 设定固定宽度 */
  margin-bottom: 10px;
}
/* 强制输入框样式 */
:deep(.el-input__wrapper) {
  border-radius: 20px;
}

/* 5. 按钮组样式 (宽度基准) */
.button-group {
  width: 260px; /* 与表单同宽 */
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-btn {
  width: 100% !important;
  height: 40px;
  border-radius: 20px;
  font-size: 15px;
  margin-left: 0 !important;
}

/* --- 弹窗相关样式 --- */
.upload-container {
  display: flex; justify-content: center; margin-bottom: 10px;
}
.dialog-avatar-wrap {
  position: relative; width: 120px; height: 120px; border-radius: 50%; cursor: pointer; overflow: hidden; border: 1px solid #eee;
}
.dialog-avatar { width: 100%; height: 100%; object-fit: cover; }
.dialog-upload-icon {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.05); color: #666; display: flex; align-items: center; justify-content: center; font-size: 28px;
  transition: all 0.3s;
}
.dialog-avatar-wrap:hover .dialog-upload-icon { background: rgba(0,0,0,0.3); color: white; }
.blue-loading {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; z-index: 10;
}
.loading-icon { color: #409EFF; font-size: 28px; animation: rotate 1.5s linear infinite; }
.hidden-upload { display: none; }

@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>