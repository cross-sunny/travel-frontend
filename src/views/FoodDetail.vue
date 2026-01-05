<template>
  <div style="padding: 50px 15%;">
    <el-row :gutter="40">
      <el-col :span="12">
        <el-image :src="info.image" style="width: 100%; border-radius: 8px;" fit="cover"></el-image>
      </el-col>
      <el-col :span="12">
        <h1>{{ info.name }}</h1>
        <div style="margin: 20px 0;">
          <el-tag v-if="info.recommend===1" type="danger" effect="dark">店长推荐</el-tag>
          <el-tag v-else type="info">特产美食</el-tag>
        </div>
        <div style="background: #fff6f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ffdede;">
          <span style="color: #999;">售价：</span>
          <span style="color: #f56c6c; font-size: 32px; font-weight: bold;">¥{{ info.price }}</span>
        </div>
        <div style="line-height: 1.8; color: #555; margin-bottom: 40px; min-height: 100px;">
          <h3>美食风味</h3>
          {{ info.description || '暂无介绍' }}
        </div>

        <el-button type="danger" size="large" icon="ShoppingCart" style="width: 200px; font-size: 18px;" @click="buy">
          立即购买
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
  request.get('/food/' + route.params.id).then(res => {
    info.value = res
  })
})

const buy = () => {
  if (!user.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  ElMessageBox.confirm('确认购买该特产美食吗？', '美味到家', {
    confirmButtonText: '支付',
    cancelButtonText: '再看看',
    type: 'success'
  }).then(() => {
    // 提交订单，类型为 FOOD
    const orderData = {
      userId: user.id,
      productId: info.value.id,
      productType: 'FOOD',
      productName: info.value.name,
      price: info.value.price
    }
    request.post('/order/create', orderData).then(() => {
      ElMessage.success('购买成功！请在订单中心查看')
      router.push('/user-center')
    })
  })
}
</script>