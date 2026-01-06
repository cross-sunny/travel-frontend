<template>
  < <div class="user-center-container">
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card class="user-card">
        <div class="avatar-container">
          <!-- 【关键修改】使用 getFullUrl 方法处理头像路径 -->
          <el-avatar :size="100" :src="getFullUrl(userInfo.avatar)" />
          <div class="edit-avatar" @click="openAvatarEdit">更换头像</div>
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

          <div style="margin-top: 20px;">
            <el-button type="primary" style="width: 100%; margin-bottom: 10px;" @click="updateInfo">保存修改</el-button>
            <el-button type="danger" plain style="width: 100%; margin-left: 0;" @click="deleteAccount">注销账号</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：我的订单 -->
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

    <!-- 更换头像弹窗 -->
    <el-dialog v-model="avatarDialogVisible" title="更换头像" width="400px" align="center">
      <!--
           修复点2：动态设置 action 上传地址
           修复点3：增加 on-error 监听
      -->
      <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          name="file"
      >
        <img v-if="newAvatarUrl" :src="getFullUrl(newAvatarUrl)" class="avatar-preview" />
        <img v-else-if="userInfo.avatar" :src="getFullUrl(userInfo.avatar)" class="avatar-preview" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>

      <p style="font-size: 12px; color: #999; margin-top: 10px;">
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
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref({})
const editForm = reactive({ nickname: '', email: '' })
const orders = ref([])
const loading = ref(false)

// 头像相关
const avatarDialogVisible = ref(false)
const newAvatarUrl = ref('')

// ==========================================
// 核心配置修改区 (这里解决了你的问题)
// ==========================================

// 1. 定义服务器地址 (你的阿里云IP)
const REMOTE_SERVER = 'http://115.175.42.16'

// 2. 定义上传接口地址
// 逻辑：无论本地调试还是线上部署，统一都往云服务器传，确保一定能成功
// 注意：前端本地调试时，这行代码会直接把图片传到 115.175.42.16 服务器上去
const uploadUrl = `${REMOTE_SERVER}/travel/api/file/upload`

// 3. 图片路径补全函数
const getFullUrl = (url) => {
  if (!url) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

  // 如果已经是网络图片(http开头)，直接显示
  if (url.startsWith('http')) return url

  // 如果是相对路径(/files/开头)，强行补全云服务器IP
  // 这样无论你在本地还是在服务器访问，都能准确找到图片
  if (url.startsWith('/files')) {
    return `${REMOTE_SERVER}${url}`
  }
  return url
}
// ==========================================

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

// 计算属性给主页面头像用
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

const handleAvatarSuccess = (response, uploadFile) => {
  // 后端返回结构 { code: "200", data: "/files/xxx.jpg" }
  if (response.code === '200') {
    newAvatarUrl.value = response.data
    ElMessage.success('上传成功，请点击确定更换')
  } else {
    ElMessage.error('上传业务失败: ' + response.msg)
  }
}

const handleAvatarError = (err) => {
  console.error('上传报错:', err)
  ElMessage.error('上传请求失败，请检查网络或F12控制台')
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
.user-center-container { width: 1200px; margin: 40px auto; }
.user-card { text-align: center; position: relative; }
.avatar-container { position: relative; width: 100px; margin: 0 auto; cursor: pointer; }
.edit-avatar {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); color: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; opacity: 0; transition: opacity 0.3s;
}
.avatar-container:hover .edit-avatar { opacity: 1; }

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color); border-radius: 6px; cursor: pointer;
  position: relative; overflow: hidden; transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover { border-color: var(--el-color-primary); }
.avatar-uploader-icon {
  font-size: 28px; color: #8c939d; width: 120px; height: 120px;
  text-align: center; border: 1px dashed #d9d9d9; border-radius: 50%; line-height: 120px;
}
.avatar-preview {
  width: 120px; height: 120px; display: block; border-radius: 50%; object-fit: cover; border: 1px solid #eee;
}
</style>