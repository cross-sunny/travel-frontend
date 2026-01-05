<template>
  <div>
    <!-- 欢迎语 -->
    <div style="margin-bottom: 20px;">
      <h2 style="margin-bottom: 5px;">👋 欢迎回来，管理员</h2>
      <p style="color: #999;">这里是搬木民宿庄园的数据概览中心。</p>
    </div>

    <!-- 数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="data-card card-1">
          <div class="card-title">总用户数</div>
          <div class="card-num">108</div>
          <div class="card-icon"><el-icon><User /></el-icon></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card card-2">
          <div class="card-title">景点&民宿</div>
          <div class="card-num">24</div>
          <div class="card-icon"><el-icon><House /></el-icon></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card card-3">
          <div class="card-title">总订单量</div>
          <div class="card-num">356</div>
          <div class="card-icon"><el-icon><Tickets /></el-icon></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card card-4">
          <div class="card-title">总交易额</div>
          <div class="card-num">¥ 42,890</div>
          <div class="card-icon"><el-icon><Wallet /></el-icon></div>
        </div>
      </el-col>
    </el-row>

    <!-- 下方图片美化 -->
    <el-card style="margin-top: 30px;">
      <template #header>
        <div class="card-header">
          <span>🏞️ 实时监控画面</span>
        </div>
      </template>
      <img src="https://img.zcool.cn/community/01f06e5d0859cca8012051cd108253.jpg@1280w_1l_2o_100sh.jpg" style="width: 100%; border-radius: 8px;">
    </el-card>
  </div>
</template>

<style scoped>
.data-card {
  position: relative;
  height: 120px;
  border-radius: 8px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.data-card:hover {
  transform: translateY(-5px);
}
.card-title { font-size: 14px; opacity: 0.9; }
.card-num { font-size: 32px; font-weight: bold; margin-top: 10px; }
.card-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 40px;
  opacity: 0.2;
}
/* 渐变色背景 */
.card-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.card-2 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #fff; }
.card-3 { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.card-4 { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: #fff; }
</style>