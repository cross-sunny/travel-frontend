<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="openAdd">发布新美食</el-button>
      <el-input v-model="search" placeholder="搜索美食名称" style="width: 200px; margin-left: 10px;" @input="load"></el-input>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="图片" width="100">
        <template #default="scope">
          <el-image :src="scope.row.image" style="width: 60px; height: 60px; border-radius: 4px;" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="美食名称" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column label="是否推荐" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.recommend === 1 ? 'success' : 'info'">
            {{ scope.row.recommend === 1 ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="美食信息" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" type="number" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="form.image" />
        </el-form-item>
        <el-form-item label="推荐">
          <el-switch v-model="form.recommend" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="描述">
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
const form = reactive({ id: null, name: '', price: '', image: '', description: '', recommend: 0 })

const load = () => {
  request.get('/food/list', { params: { name: search.value } }).then(res => {
    tableData.value = res
  })
}

const openAdd = () => {
  Object.assign(form, { id: null, name: '', price: '', image: '', description: '', recommend: 0 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const save = () => {
  const url = form.id ? '/food/update' : '/food/add'
  request.post(url, form).then(() => {
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  })
}

const handleDelete = (id) => {
  request.delete('/food/delete/' + id).then(() => {
    ElMessage.success('删除成功')
    load()
  })
}

onMounted(load)
</script>