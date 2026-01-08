<template>
  <div>
    <!-- 顶部操作栏 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" icon="Plus" @click="openAdd">发布新美食</el-button>

      <!-- 搜索框 -->
      <el-input
          v-model="search"
          placeholder="搜索美食名称..."
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

      <!-- 悬浮特效列：美食图片 -->
      <el-table-column label="图片 (悬浮查看)" width="150" align="center">
        <template #default="scope">
          <el-popover placement="right" :width="300" trigger="hover">
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
              <h3 style="margin: 5px 0; color: #333;">{{ scope.row.name }}</h3>
              <div style="text-align: left; background: #fff6f6; padding: 10px; border-radius: 6px; font-size: 13px; color: #666; line-height: 1.6; max-height: 150px; overflow-y: auto;">
                {{ scope.row.description || '暂无简介' }}
              </div>
              <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <el-tag v-if="scope.row.recommend === 1" type="danger" effect="dark">店长推荐</el-tag>
                <el-tag v-else type="info">普通</el-tag>
                <span style="color: #f56c6c; font-weight: bold; font-size: 16px;">¥{{ scope.row.price }}</span>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="美食名称" min-width="150" show-overflow-tooltip />

      <el-table-column prop="price" label="价格" width="100">
        <template #default="scope">¥{{ scope.row.price }}</template>
      </el-table-column>

      <el-table-column label="是否推荐" width="120" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.recommend"
              :active-value="1"
              :inactive-value="0"
              active-text="推荐"
              inactive-text="普通"
              inline-prompt
              @change="handleRecommendChange(scope.row)"
          />
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
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑美食' : '新增美食'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入美食名称" />
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model="form.price" type="number" placeholder="请输入价格">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="推荐">
          <el-switch v-model="form.recommend" :active-value="1" :inactive-value="0" />
          <span style="margin-left: 10px; color: #999; font-size: 12px;">开启后会在首页优先展示</span>
        </el-form-item>

        <el-form-item label="图片URL">
          <el-input v-model="form.image" type="textarea" :rows="2" placeholder="输入图片链接" />
        </el-form-item>

        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="描述一下这道美食的味道..." />
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
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const search = ref('')
const dialogVisible = ref(false)

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 美食表单对象：没有 city 和 star，只有 recommend
const form = reactive({
  id: null,
  name: '',
  price: '',
  image: '',
  description: '',
  recommend: 0
})

// 加载数据
const load = () => {
  loading.value = true
  // 注意接口是 /food/page
  request.get('/food/page', {
    params: {
      name: search.value, // 后端搜索字段是 name
      page: currentPage.value,
      size: pageSize.value
    }
  }).then(res => {
    tableData.value = res.records
    total.value = res.total
  }).finally(() => {
    loading.value = false
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

// 快速切换推荐状态
const handleRecommendChange = (row) => {
  request.post('/food/update', row).then(() => {
    ElMessage.success('状态更新成功')
  })
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
  ElMessageBox.confirm('确定删除该美食吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/food/delete/' + id).then(() => {
      ElMessage.success('删除成功')
      load()
    })
  })
}

onMounted(load)
</script>