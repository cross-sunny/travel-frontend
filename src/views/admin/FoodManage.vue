<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" icon="Plus" @click="openAdd">发布新美食</el-button>
      <el-input
          v-model="search"
          placeholder="搜索美食名称"
          prefix-icon="Search"
          style="width: 250px; margin-left: 15px;"
          @input="load"
          clearable
      />
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="60" align="center" />

      <!-- 悬浮特效列 -->
      <el-table-column label="图片 (悬浮查看)" width="150" align="center">
        <template #default="scope">
          <el-popover placement="right" :width="280" trigger="hover">
            <template #reference>
              <el-image :src="scope.row.image" style="width: 60px; height: 60px; border-radius: 50%; cursor: pointer; border: 2px solid #eee;" fit="cover" />
            </template>
            <!-- 悬浮内容 -->
            <div style="text-align: center;">
              <img :src="scope.row.image" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
              <h3 style="margin: 5px 0;">{{ scope.row.name }}</h3>
              <el-tag v-if="scope.row.recommend === 1" type="danger" effect="dark" round>店长推荐</el-tag>
              <p style="color: #666; font-size: 13px; margin-top: 10px;">{{ scope.row.description }}</p>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="美食名称" />
      <el-table-column prop="price" label="价格" width="100">
        <template #default="scope">¥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="是否推荐" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.recommend === 1 ? 'danger' : 'info'">
            {{ scope.row.recommend === 1 ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" icon="Delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑美食' : '新增美食'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="价格"><el-input v-model="form.price" type="number" /></el-form-item>
        <el-form-item label="图片URL"><el-input v-model="form.image" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="推荐">
          <el-switch v-model="form.recommend" :active-value="1" :inactive-value="0" active-text="推荐" inactive-text="普通" />
        </el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
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
const form = reactive({ id: null, name: '', price: '', image: '', description: '', recommend: 0 })

const load = () => {
  request.get('/food/list', { params: { name: search.value } }).then(res => {
    tableData.value = res
  })
}

const openAdd = () => { Object.assign(form, { id: null, name: '', price: '', image: '', description: '', recommend: 0 }); dialogVisible.value = true }
const handleEdit = (row) => { Object.assign(form, row); dialogVisible.value = true }
const save = () => {
  const url = form.id ? '/food/update' : '/food/add'
  request.post(url, form).then(() => { ElMessage.success('保存成功'); dialogVisible.value = false; load() })
}
const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/food/delete/' + id).then(() => { ElMessage.success('删除成功'); load() })
  })
}
onMounted(load)
</script>