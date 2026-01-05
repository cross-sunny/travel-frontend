<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-tag size="large">订单管理中心</el-tag>
      <el-button type="primary" plain style="float: right;" @click="load">刷新列表</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="订单号" width="80" />
      <el-table-column prop="productName" label="商品名称" />
      <el-table-column prop="productType" label="类型" width="100">
        <template #default="scope">
          <el-tag :type="getTypeTag(scope.row.productType)">
            {{ getTypeLabel(scope.row.productType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="交易金额" width="100">
        <template #default="scope">
          <span style="color: #f56c6c; font-weight: bold;">¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" width="80" />
      <el-table-column prop="createTime" label="下单时间" width="180">
        <template #default="scope">
          {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag type="success" effect="dark">已支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-popconfirm title="确定删除这条订单记录吗？" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
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

const load = () => {
  // 调用刚才后端新加的接口
  request.get('/order/list').then(res => {
    tableData.value = res
  })
}

const handleDelete = (id) => {
  request.delete('/order/delete/' + id).then(() => {
    ElMessage.success('删除成功')
    load()
  })
}

const getTypeTag = (type) => {
  if (type === 'SCENIC') return 'success'
  if (type === 'HOTEL') return 'warning'
  return 'primary'
}

const getTypeLabel = (type) => {
  if (type === 'SCENIC') return '景点'
  if (type === 'HOTEL') return '酒店'
  if (type === 'FOOD') return '美食'
  return type
}

onMounted(load)
</script>