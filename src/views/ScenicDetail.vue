<template>
  <div style="padding: 50px 15%;">
    <el-row :gutter="40">
      <!-- 左侧图片 -->
      <el-col :span="12">
        <el-image :src="info.image" style="width: 100%; border-radius: 8px;" fit="cover"></el-image>
      </el-col>
      <!-- 右侧信息 -->
      <el-col :span="12">
        <h1>{{ info.title }}</h1>
        <div style="color: #666; margin: 20px 0;">
          <el-tag type="success">{{ info.city }}</el-tag>
          <el-rate v-model="info.star" disabled show-score style="margin-left: 20px;"/>
        </div>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <span style="color: #999;">价格：</span>
          <span style="color: #f60; font-size: 32px; font-weight: bold;">¥{{ info.price }}</span>
          <span style="color: #999;"> /人</span>
        </div>
        <div style="line-height: 1.8; color: #555; margin-bottom: 40px;">
          {{ info.description || '暂无详细介绍' }}
        </div>

        <el-button type="primary" size="large" style="width: 200px; font-size: 18px;" @click="book">
          立即预定
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const info = ref({})
const user = JSON.parse(localStorage.getItem('user') || '{}')

onMounted(() => {
  const id = route.params.id
  request.get('/scenic/' + id).then(res => {
    info.value = res
  })
})

const book = () => {
  if (!user.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  ElMessageBox.confirm('确认预定该景点门票吗？', '提示', {
    confirmButtonText: '确定支付',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 调用后端下单接口
    const orderData = {
      userId: user.id,
      productId: info.value.id,
      productType: 'SCENIC', // 标记类型
      productName: info.value.title,
      price: info.value.price
    }
    request.post('/order/create', orderData).then(() => {
      ElMessage.success('预定成功！')
      router.push('/user-center') // 跳转到个人中心
    })
  })
}
</script>