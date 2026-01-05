<template>
  <div>
    <!-- 搜索栏 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="add">添加用户</el-button>
      <el-input v-model="search" placeholder="请输入用户名搜索" style="width: 200px; margin-left: 10px;"></el-input>
      <el-button type="primary" style="margin-left: 10px;" @click="load">查询</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="email" label="邮箱" /><!-- width="180" -->

      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'success'">
            {{ scope.row.role === 'ADMIN' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 悬浮展示：这里模仿你图二的 Popover 效果 -->
      <el-table-column label="详情 (悬浮查看)">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div style="text-align: center;">
                <p>姓名: {{ scope.row.nickname }}</p>
                <p>介绍: 这个人很懒...</p>
              </div>
            </template>
            <template #reference>
              <el-tag>移入查看</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const search = ref('')

const load = () => {
  // 调用后端接口查询，注意后端 Controller 要支持 search 参数
  // 如果还没写 search，可以先 request.get('/user/list')
  // 这里为了演示，假设你后端是 RESTful 风格，或者用 MyBatis-Plus 的 list
  request.get('/user/list').then(res => {
    tableData.value = res
  })
}

const handleDelete = (id) => {
  // 确认删除逻辑
  request.delete('/user/delete/' + id).then(res => {
    ElMessage.success('删除成功')
    load()
  })
}

onMounted(() => {
  load()
})
</script>