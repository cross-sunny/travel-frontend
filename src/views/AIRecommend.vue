<template>
  <div class="ai-container">
    <div class="ai-card">
      <div class="header">
        <h2>✨ AI 灵感规划师</h2>
        <p>基于 DeepSeek 大模型，为您定制专属行程</p>
      </div>

      <!-- 1. 分类标签选择 -->
      <div class="tag-section">
        <div class="tag-category">
          <span class="label">我想看：</span>
          <div class="tags">
            <span v-for="t in scenicTags" :key="t" @click="toggleTag(t)" :class="{active: selectedTags.includes(t)}">{{ t }}</span>
          </div>
        </div>
        <div class="tag-category">
          <span class="label">我想住：</span>
          <div class="tags">
            <span v-for="t in hotelTags" :key="t" @click="toggleTag(t)" :class="{active: selectedTags.includes(t)}">{{ t }}</span>
          </div>
        </div>
        <div class="tag-category">
          <span class="label">我想吃：</span>
          <div class="tags">
            <span v-for="t in foodTags" :key="t" @click="toggleTag(t)" :class="{active: selectedTags.includes(t)}">{{ t }}</span>
          </div>
        </div>
      </div>

      <!-- 2. 自定义输入 -->
      <div class="input-section">
        <el-input
            v-model="customInput"
            placeholder="还有什么特殊需求？（例如：带孩子、预算有限、喜欢拍照...）"
            size="large"
            clearable
        >
          <template #prefix><el-icon><Edit /></el-icon></template>
        </el-input>
      </div>

      <!-- 3. 生成按钮 -->
      <div style="text-align: center; margin-bottom: 30px;">
        <el-button
            color="#6366f1"
            size="large"
            round
            class="generate-btn"
            :loading="loading"
            @click="generatePlan"
        >
          <el-icon style="margin-right:5px"><MagicStick /></el-icon>
          {{ loading ? 'AI 正在分析全网数据...' : '生成定制方案' }}
        </el-button>
      </div>

      <!-- 4. AI 回复 -->
      <div v-if="aiReply" class="ai-reply-box">
        <div class="ai-avatar">🤖</div>
        <div class="ai-content">
          <div class="typing-text">{{ displayedText }}</div>
        </div>
      </div>

      <!-- 5. 推荐结果 (3栏布局) -->
      <div v-if="showResults" class="result-container">

        <div class="result-column">
          <h3 class="col-title" style="color: #409EFF">🏔️ 推荐景点</h3>
          <div v-for="item in result.scenic" :key="item.id" class="mini-card" @click="$router.push('/scenic/'+item.id)">
            <img :src="item.image">
            <div class="info">
              <h4>{{ item.title }}</h4>
              <p>¥{{ item.price }}</p>
            </div>
          </div>
        </div>

        <div class="result-column">
          <h3 class="col-title" style="color: #E6A23C">🏠 推荐民宿</h3>
          <div v-for="item in result.hotel" :key="item.id" class="mini-card" @click="$router.push('/hotel/'+item.id)">
            <img :src="item.image">
            <div class="info">
              <h4>{{ item.name }}</h4>
              <p>¥{{ item.price }}</p>
            </div>
          </div>
        </div>

        <div class="result-column">
          <h3 class="col-title" style="color: #F56C6C">🍲 推荐美食</h3>
          <div v-for="item in result.food" :key="item.id" class="mini-card" @click="$router.push('/food/'+item.id)">
            <img :src="item.image">
            <div class="info">
              <h4>{{ item.name }}</h4>
              <p>¥{{ item.price }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import request from '@/utils/request'
import { Edit, MagicStick } from '@element-plus/icons-vue'

const scenicTags = ['自然风光', '历史古迹', '网红打卡', '爬山', '看海']
const hotelTags = ['奢华酒店', '特色民宿', '高性价比', '亲子房', '情侣房']
const foodTags = ['地道小吃', '豪华大餐', '辣味十足', '甜品', '海鲜']

const selectedTags = ref([])
const customInput = ref('')
const loading = ref(false)
const showResults = ref(false)
const aiReply = ref('')
const displayedText = ref('')
const result = ref({ scenic: [], hotel: [], food: [] })

const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const typeWriter = (text) => {
  let i = 0
  displayedText.value = ''
  const interval = setInterval(() => {
    displayedText.value += text.charAt(i)
    i++
    if (i > text.length) {
      clearInterval(interval)
      showResults.value = true
    }
  }, 30)
}

const generatePlan = () => {
  if (selectedTags.value.length === 0 && !customInput.value) {
    return alert('请至少选择一个标签或输入需求')
  }

  loading.value = true
  showResults.value = false
  aiReply.value = ''

  request.post('/ai/generate', {
    tags: selectedTags.value,
    customInput: customInput.value
  }, {
    timeout: 20000 // 设置为 20 秒超时
  }).then(res => {
    aiReply.value = res.analysis
    result.value = res // 直接赋值，因为后端已经把数据分好了 scenic, hotel, food
    loading.value = false
    typeWriter(res.analysis)
  }).catch(err => {
    loading.value = false
    console.error(err) // 打印错误方便调试
    if (err.code === 'ECONNABORTED') {
      alert('AI 思考时间过长，请重试（建议减少标签或字数）')
    } else {
      alert('AI 服务繁忙，请稍后再试')
    }
  })
}
</script>

<style scoped>
.ai-container { width: 1200px; margin: 30px auto; display: flex; justify-content: center; }
.ai-card { width: 1000px; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.header { text-align: center; margin-bottom: 30px; }
.header h2 { font-size: 28px; margin-bottom: 10px; background: linear-gradient(to right, #6366f1, #a855f7); -webkit-background-clip: text; color: transparent; }

.tag-section { margin-bottom: 30px; }
.tag-category { display: flex; align-items: center; margin-bottom: 15px; }
.label { font-weight: bold; margin-right: 15px; width: 70px; }
.tags { display: flex; gap: 10px; flex-wrap: wrap; }
.tags span { padding: 6px 16px; background: #f3f4f6; border-radius: 20px; cursor: pointer; transition: 0.2s; color: #555; }
.tags span.active { background: #6366f1; color: white; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3); }

.input-section { margin-bottom: 30px; padding: 0 50px; }
.generate-btn { padding: 12px 40px; font-size: 16px; transition: transform 0.2s; }
.generate-btn:hover { transform: scale(1.05); }

.ai-reply-box { background: #f0fdf4; padding: 20px; border-radius: 12px; display: flex; gap: 15px; margin-bottom: 30px; border: 1px solid #dcfce7; }
.ai-avatar { font-size: 24px; background: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.ai-content { flex: 1; }
.typing-text { color: #166534; line-height: 1.6; font-size: 15px; }

.result-container { display: flex; gap: 20px; }
.result-column { flex: 1; background: #fafafa; padding: 15px; border-radius: 12px; }
.col-title { text-align: center; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #eee; padding-bottom: 10px; }

.mini-card { background: white; border-radius: 10px; overflow: hidden; margin-bottom: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.mini-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.mini-card img { width: 100%; height: 120px; object-fit: cover; }
.mini-card .info { padding: 10px; }
.mini-card h4 { margin: 0 0 5px 0; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-card p { color: #f56c6c; font-weight: bold; margin: 0; }
</style>