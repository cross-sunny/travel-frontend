<template>
  <div>
    <!-- 顶部操作栏 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" icon="Plus" @click="openAdd">发布新景点</el-button>
      <el-input
          v-model="search"
          placeholder="搜索景点名称"
          prefix-icon="Search"
          style="width: 250px; margin-left: 15px;"
          @input="load"
          clearable
      />
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center" />

      <!-- 悬浮特效列 -->
      <el-table-column label="封面 (悬浮查看)" width="150" align="center">
        <template #default="scope">
          <el-popover placement="right" :width="320" trigger="hover">
            <template #reference>
              <!-- 列表显示小缩略图 -->
              <el-image
                  :src="scope.row.image"
                  style="width: 80px; height: 60px; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"
                  fit="cover"
              />
            </template>
            <!-- 悬浮弹窗内容 -->
            <div style="text-align: center;">
              <img :src="scope.row.image" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
              <h3 style="margin: 5px 0; color: #333;">{{ scope.row.title }}</h3>
              <div style="text-align: left; background: #f8f8f8; padding: 10px; border-radius: 6px; font-size: 13px; color: #666; line-height: 1.6;">
                {{ scope.row.description || '暂无简介' }}
              </div>
              <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                <el-tag type="warning">推荐: {{ scope.row.star }}星</el-tag>
                <span style="color: #f56c6c; font-weight: bold;">¥{{ scope.row.price }}/人</span>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="景点名称" />
      <el-table-column prop="city" label="城市" width="120">
        <template #default="scope">
          <el-tag type="info" effect="plain">{{ scope.row.city }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="门票" width="100">
        <template #default="scope">¥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column prop="star" label="星级" width="160">
        <template #default="scope">
          <el-rate v-model="scope.row.star" disabled text-color="#ff9900" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" icon="Delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑景点' : '新增景点'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="城市"><el-input v-model="form.city" /></el-form-item>
        <el-form-item label="价格"><el-input v-model="form.price" type="number" /></el-form-item>
        <el-form-item label="星级"><el-rate v-model="form.star" /></el-form-item>
        <el-form-item label="封面URL"><el-input v-model="form.image" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
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
  ElMessageBox.confirm('确定删除该景点吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/scenic/delete/' + id).then(() => {
      ElMessage.success('删除成功')
      load()
    })
  })
}

onMounted(load)
</script>