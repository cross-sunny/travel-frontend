<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="openAdd">发布新景点</el-button>
      <el-input v-model="search" placeholder="搜索景点名称" style="width: 200px; margin-left: 10px;" @input="load"></el-input>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="封面图" width="120">
        <template #default="scope">
          <el-image :src="scope.row.image" style="width: 80px; height: 60px; border-radius: 4px;" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="景点名称" />
      <el-table-column prop="city" label="城市" width="100" />
      <el-table-column prop="price" label="门票(元)" width="100" />
      <el-table-column prop="star" label="推荐指数" width="150">
        <template #default="scope">
          <el-rate v-model="scope.row.star" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="景点信息" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" type="number" />
        </el-form-item>
        <el-form-item label="星级">
          <el-rate v-model="form.star" />
        </el-form-item>
        <el-form-item label="封面URL">
          <el-input v-model="form.image" placeholder="请输入图片链接" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
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
import { ElMessage } from 'element-plus'

const tableData = ref([])
const search = ref('')
const dialogVisible = ref(false)
const form = reactive({ id: null, title: '', city: '', price: '', star: 5, image: '', description: '' })

const load = () => {
  request.get('/scenic/list', { params: { title: search.value } }).then(res => {
    tableData.value = res
  })
}

const openAdd = () => {
  Object.assign(form, { id: null, title: '', city: '', price: '', star: 5, image: '', description: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const save = () => {
  const url = form.id ? '/scenic/update' : '/scenic/add'
  request.post(url, form).then(() => {
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  })
}

const handleDelete = (id) => {
  request.delete('/scenic/delete/' + id).then(() => {
    ElMessage.success('删除成功')
    load()
  })
}

onMounted(load)
</script>