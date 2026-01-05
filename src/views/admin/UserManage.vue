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

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="60" align="center" />

      <!-- 悬浮特效列：用户头像+信息 -->
      <el-table-column label="用户 (悬浮查看)" width="200">
        <template #default="scope">
          <el-popover placement="top-start" :width="250" trigger="hover">
            <template #reference>
              <!-- 列表显示：头像+账号 -->
              <div style="display: flex; align-items: center; cursor: pointer;">
                <el-avatar :size="32" :src="scope.row.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
                <span style="margin-left: 10px; font-weight: bold; color: #409EFF;">{{ scope.row.username }}</span>
              </div>
            </template>
            <!-- 悬浮内容：大头像+详细信息 -->
            <div style="text-align: center; padding: 10px;">
              <el-avatar :size="80" :src="scope.row.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" style="margin-bottom: 10px;" />
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
          <!-- 只有不是管理员自己，才能删除 -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import {Message} from "@element-plus/icons-vue";

const tableData = ref([])
const search = ref('')

// 调用后端 UserController 的 list 接口
const load = () => {
  request.get('/user/list', { params: { username: search.value } }).then(res => {
    tableData.value = res
  })
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