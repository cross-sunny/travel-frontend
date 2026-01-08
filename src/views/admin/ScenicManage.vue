<template>
  <div>
    <!-- 顶部操作栏 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" icon="Plus" @click="openAdd">发布新景点</el-button>

      <!-- 搜索框 -->
      <el-input
          v-model="search"
          placeholder="搜索景点名称..."
          prefix-icon="Search"
          style="width: 250px; margin-left: 15px;"
          @keyup.enter="load"
          clearable
          @clear="load"
      />

      <el-button type="primary" plain style="margin-left: 10px;" @click="load">查询</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="60" align="center" />

      <!-- 悬浮特效列：封面图 -->
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
              <img :src="scope.row.image" style="width: 100%; border-radius: 8px; margin-bottom: 10px; max-height: 200px; object-fit: cover;">
              <h3 style="margin: 5px 0; color: #333;">{{ scope.row.title }}</h3>
              <div style="text-align: left; background: #f8f8f8; padding: 10px; border-radius: 6px; font-size: 13px; color: #666; line-height: 1.6; max-height: 150px; overflow-y: auto;">
                {{ scope.row.description || '暂无简介' }}
              </div>
              <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <el-tag type="warning">推荐: {{ scope.row.star }}星</el-tag>
                <span style="color: #f56c6c; font-weight: bold; font-size: 16px;">¥{{ scope.row.price }}</span>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="景点名称" min-width="150" show-overflow-tooltip />

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

    <!-- 分页组件 -->
    <div style="margin-top: 20px; display: flex; justify-content: center;">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="load"
          @current-change="load"
          background
      />
    </div>

    <!-- 编辑/新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑景点' : '新增景点'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="城市"><el-input v-model="form.city" /></el-form-item>
        <el-form-item label="价格"><el-input v-model="form.price" type="number" /></el-form-item>
        <el-form-item label="星级"><el-rate v-model="form.star" /></el-form-item>
        <el-form-item label="封面URL"><el-input v-model="form.image" type="textarea" :rows="2" placeholder="输入图片链接" /></el-form-item>
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

const loading = ref(false)
const tableData = ref([])
const search = ref('')
const dialogVisible = ref(false)

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({ id: null, title: '', city: '', price: '', star: 5, image: '', description: '' })

// 加载数据 (核心：调用 /page 接口)
const load = () => {
  loading.value = true
  request.get('/scenic/page', {
    params: {
      title: search.value,
      page: currentPage.value,
      size: pageSize.value
    }
  }).then(res => {
    // 后端返回 Page 对象: { records: [...], total: 100, ... }
    tableData.value = res.records
    total.value = res.total
  }).finally(() => {
    loading.value = false
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
    load() // 刷新列表
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