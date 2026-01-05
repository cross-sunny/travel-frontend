<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" icon="Plus" @click="openAdd">发布新民宿</el-button>
      <el-input
          v-model="search"
          placeholder="搜索民宿名称"
          prefix-icon="Search"
          style="width: 250px; margin-left: 15px;"
          @input="load"
          clearable
      />
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="60" align="center" />

      <!-- 悬浮特效列 -->
      <el-table-column label="封面 (悬浮查看)" width="150" align="center">
        <template #default="scope">
          <el-popover placement="right" :width="300" trigger="hover">
            <template #reference>
              <el-image :src="scope.row.image" style="width: 80px; height: 60px; border-radius: 6px; cursor: pointer;" fit="cover" />
            </template>
            <!-- 悬浮内容 -->
            <div style="text-align: center;">
              <img :src="scope.row.image" style="width: 100%; border-radius: 8px;">
              <h4 style="margin: 10px 0;">{{ scope.row.name }}</h4>
              <div style="text-align: left; font-size: 13px; color: #555; margin-bottom: 8px;">
                <el-icon><Location /></el-icon> {{ scope.row.address }}
              </div>
              <p style="text-align: left; color: #999; font-size: 12px; line-height: 1.5;">{{ scope.row.description }}</p>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="民宿名称" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="price" label="价格(晚)" width="100">
        <template #default="scope">
          <span style="color: #409EFF; font-weight: bold;">¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" icon="Delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑民宿' : '新增民宿'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="地址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="价格"><el-input v-model="form.price" type="number" /></el-form-item>
        <el-form-item label="图片URL"><el-input v-model="form.image" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="介绍"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const search = ref('')
const dialogVisible = ref(false)
const form = reactive({ id: null, name: '', address: '', price: '', image: '', description: '' })

const load = () => {
  request.get('/hotel/list', { params: { name: search.value } }).then(res => {
    tableData.value = res
  })
}

const openAdd = () => { Object.assign(form, { id: null, name: '', address: '', price: '', image: '', description: '' }); dialogVisible.value = true }
const handleEdit = (row) => { Object.assign(form, row); dialogVisible.value = true }
const save = () => {
  const url = form.id ? '/hotel/update' : '/hotel/add'
  request.post(url, form).then(() => { ElMessage.success('保存成功'); dialogVisible.value = false; load() })
}
const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该民宿吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/hotel/delete/' + id).then(() => { ElMessage.success('删除成功'); load() })
  })
}
onMounted(load)
</script>