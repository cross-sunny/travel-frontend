<template>
  <div class="user-center-container">
    <el-row :gutter="20">
      <!-- 左侧：个人信息卡片 -->
      <el-col :span="8">
        <el-card class="user-card">
          <div class="avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
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
            <!-- 电话字段已删除 -->
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
    <el-dialog v-model="avatarDialogVisible" title="更换头像" width="400px">
      <el-input v-model="newAvatarUrl" placeholder="请输入新的头像图片URL地址" />
      <div style="margin-top: 10px; text-align: center;">
        <p style="font-size: 12px; color: #999;">预览：</p>
        <el-avatar :size="80" :src="newAvatarUrl || userInfo.avatar" />
      </div>
      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAvatar">确定更换</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref({})
// 删除 phone 初始化
const editForm = reactive({ nickname: '', email: '' })
const orders = ref([])
const loading = ref(false)

const avatarDialogVisible = ref(false)
const newAvatarUrl = ref('')

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if(userStr) {
    userInfo.value = JSON.parse(userStr)
    // 初始化编辑表单，移除 phone 赋值
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

// 修改信息
const updateInfo = () => {
  const data = {
    id: userInfo.value.id,
    nickname: editForm.nickname
    // phone 字段已移除
  }
  request.post('/user/update', data).then(res => {
    ElMessage.success('信息保存成功')
    userInfo.value = res
    localStorage.setItem('user', JSON.stringify(res))
    setTimeout(() => location.reload(), 500)
  })
}

const openAvatarEdit = () => {
  newAvatarUrl.value = userInfo.value.avatar || ''
  avatarDialogVisible.value = true
}

const saveAvatar = () => {
  if (!newAvatarUrl.value) return ElMessage.warning('请输入图片地址')
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
      '注销后无法恢复，您的所有数据将被永久删除。确定要注销吗？',
      '危险操作警告',
      {
        confirmButtonText: '确定注销',
        cancelButtonText: '我再想想',
        type: 'error'
      }
  ).then(() => {
    request.delete('/user/delete-self/' + userInfo.value.id).then(() => {
      ElMessage.success('账号已注销，江湖再见')
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
}
.avatar-container {
  position: relative;
  width: 100px;
  margin: 0 auto;
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
</style>