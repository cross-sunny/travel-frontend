<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-tag size="large" effect="dark">用户管理中心</el-tag>
      <el-input
          v-model="search"
          placeholder="搜索账号..."
          prefix-icon="Search"
          style="width: 250px; margin-left: 15px;"
          @input="load"
          clearable
      />
      <el-button type="primary" style="margin-left: 10px;" @click="load">刷新</el-button>
    </div>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" align="center" />

      <!-- 用户信息列 -->
      <el-table-column label="用户 (悬浮查看)" width="200">
        <template #default="scope">
          <el-popover placement="top-start" :width="250" trigger="hover">
            <template #reference>
              <div style="display: flex; align-items: center; cursor: pointer;">
                <el-avatar :size="32" :src="getFullUrl(scope.row.avatar)" />
                <span style="margin-left: 10px; font-weight: bold; color: #409EFF;">{{ scope.row.username }}</span>
              </div>
            </template>
            <div style="text-align: center; padding: 10px;">
              <el-avatar :size="80" :src="getFullUrl(scope.row.avatar)" style="margin-bottom: 10px;" />
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">{{ scope.row.nickname || '未设置昵称' }}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 10px;">
                <el-icon><Message /></el-icon> {{ scope.row.email || '未绑定邮箱' }}
              </div>
              <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'success'">
                {{ scope.row.role === 'ADMIN' ? '管理员' : '普通用户' }}
              </el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'success'">
            {{ scope.row.role === 'ADMIN' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <!-- 管理员不能删除自己 -->
          <el-button
              v-if="scope.row.username !== 'admin'"
              size="small"
              type="danger"
              icon="Delete"
              @click="handleDelete(scope.row.id)"
          >
            删除用户
          </el-button>
          <el-tag v-else type="info">不可操作</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 (新增) -->
    <div style="margin-top: 20px; display: flex; justify-content: center;">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="10"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import {Message} from "@element-plus/icons-vue";

const tableData = ref([])
const search = ref('')
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)

// 处理图片路径，防止头像裂开
const getFullUrl = (url) => {
  if (!url) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  if (url.startsWith('http')) return url
  // 生产环境用相对路径，本地开发强制补全服务器IP
  if (url.startsWith('/files')) {
    return import.meta.env.MODE === 'production' ? url : 'http://115.175.42.16' + url
  }
  return url
}

const load = () => {
  loading.value = true
  // 关键修正：后端现在返回的是 Page 对象，我们需要 .records 才是数组
  request.get('/user/list', {
    params: {
      username: search.value,
      page: currentPage.value,
      size: 10
    }
  }).then(res => {
    // 后端 Result.success(page对象)
    // 这里的 res 就是那个 page 对象
    tableData.value = res.records
    total.value = res.total
  }).finally(() => {
    loading.value = false
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
  load()
}

const handleDelete = (id) => {
  ElMessageBox.confirm('删除用户会导致其订单数据异常，确认删除吗？', '危险操作', {
    confirmButtonText: '强制删除',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    request.delete('/user/delete/' + id).then(res => {
      ElMessage.success('用户已删除')
      load()
    })
  })
}

onMounted(load)
</script>