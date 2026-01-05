<!-- 必须包含 <template> 标签（Vue单文件组件的核心要求） -->
<template>
  <!-- 路由出口：所有页面通过 vue-router 渲染到这里 -->
  <router-view />
</template>

<!-- 可选的 script 标签（空也可以，保证语法合法） -->
<script setup>
// 空脚本，仅保证组件语法合法
</script>

<!-- 可选的全局样式（可根据需要修改） -->
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Microsoft YaHei", sans-serif;
}
</style>