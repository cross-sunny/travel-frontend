<template>
  <div class="user-center-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="user-card">
          <div class="avatar-container" @click="openAvatarEdit">
            <el-avatar :size="100" :src="getFullUrl(userInfo.avatar)" />
            <div class="edit-avatar">更换头像</div>
          </div>

          <h2 style="margin: 10px 0;">{{ userInfo.nickname || userInfo.username }}</h2>
          <el-tag :type="userInfo.role === 'ADMIN' ? 'danger' : 'success'">
            {{ userInfo.role === 'ADMIN' ? '管理员' : '普通用户' }}
          </el-tag>

          <el-divider />

          <el-form label-width="60px" style="text-align: left;">
            <el-form-item label="账号">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="editForm.nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="editForm.email" disabled placeholder="不支持修改" />
            </el-form-item>
          </el-form>

          <!-- 按钮组：强制固定宽度+居中 -->
          <div class="button-group">
            <el-button type="primary" @click="updateInfo">保存修改</el-button>
            <el-button type="danger" plain @click="deleteAccount">注销账号</el-button>
          </div>
        </el-card>
      </el-col>

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
        点击上方图片上传本地文件 (支持 JPG/PNG，小于10MB)
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
import { Upload, Loading } from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref({})
const editForm = reactive({ nickname: '', email: '' })
const orders = ref([])
const loading = ref(false)
const uploadRef = ref(null)

const avatarDialogVisible = ref(false)
const newAvatarUrl = ref('')
const isAvatarUploading = ref(false)

const REMOTE_SERVER = 'http://115.175.42.16'
const uploadUrl = `${REMOTE_SERVER}/travel/api/file/upload`
const getFullUrl = (url) => {
  if (!url) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  if (url.startsWith('http')) return url
  if (url.startsWith('/files')) {
    return `${REMOTE_SERVER}${url}`
  }
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

const computedAvatar = computed(() => {
  return getFullUrl(userInfo.value.avatar)
})

const loadOrders = () => {
  loading.value = true
  request.get('/order/my', { params: { userId: userInfo.value.id } }).then(res => {
    orders.value = res
  }).finally(() => loading.value = false)
}

const updateInfo = () => {
  const data = {
    id: userInfo.value.id,
    nickname: editForm.nickname
  }
  request.post('/user/update', data).then(res => {
    ElMessage.success('信息保存成功')
    userInfo.value = res
    localStorage.setItem('user', JSON.stringify(res))
    setTimeout(() => location.reload(), 500)
  })
}

const openAvatarEdit = () => {
  newAvatarUrl.value = ''
  avatarDialogVisible.value = true
}

const triggerUpload = () => {
  uploadRef.value.$el.querySelector('input[type="file"]').click()
}

const handleUploadProgress = () => {
  isAvatarUploading.value = true
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('图片大小不能超过 10MB!')
    return false
  }
  isAvatarUploading.value = true
  return true
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
  ElMessage.error('上传请求失败，请检查网络或文件大小')
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
.user-center-container {
  width: 1200px;
  margin: 40px auto;
}
.user-card {
  text-align: center;
  position: relative;
  padding: 20px 0;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  cursor: pointer;
}
.edit-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}
.avatar-container:hover .edit-avatar {
  opacity: 1;
}

.button-group {
  margin: 24px auto 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 200px;
}

.button-group .el-button {
  width: 200px !important;
  padding: 8px 0;
  font-size: 14px;
}
.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.dialog-avatar-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}
.dialog-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.dialog-upload-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  background: rgba(0,0,0,0.4);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.dialog-avatar-wrap:hover .dialog-upload-icon {
  opacity: 1;
}
.blue-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.loading-icon {
  color: var(--el-color-primary);
  font-size: 28px;
  animation: rotate 1.5s linear infinite;
}
.hidden-upload {
  display: none;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>