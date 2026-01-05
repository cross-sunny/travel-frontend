<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="openAdd">发布新民宿</el-button>
      <el-input v-model="search" placeholder="搜索民宿名称" style="width: 200px; margin-left: 10px;" @input="load"></el-input>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="封面" width="120">
        <template #default="scope">
          <el-image :src="scope.row.image" style="width: 80px; height: 60px; border-radius: 4px;" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="民宿名称" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="price" label="价格(晚)" width="100" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="民宿信息" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" type="number" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="form.image" placeholder="输入图片链接" />
        </el-form-item>
        <el-form-item label="介绍">
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
const form = reactive({ id: null, name: '', address: '', price: '', image: '', description: '' })

const load = () => {
  request.get('/hotel/list', { params: { name: search.value } }).then(res => {
    tableData.value = res
  })
}

const openAdd = () => {
  Object.assign(form, { id: null, name: '', address: '', price: '', image: '', description: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const save = () => {
  const url = form.id ? '/hotel/update' : '/hotel/add'
  request.post(url, form).then(() => {
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  })
}

const handleDelete = (id) => {
  request.delete('/hotel/delete/' + id).then(() => {
    ElMessage.success('删除成功')
    load()
  })
}

onMounted(load)
</script>