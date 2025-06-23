<template>
  <div id="app-wrapper">
    <div class="background-gradient"></div>

    <div id="app-container">
      <header class="app-header">
        <div class="logo-title">墨墨背填空</div>
        <nav class="main-nav">
          <button @click="isUploadPanelVisible = true" class="upload-btn-header">
            上传题库
          </button>
          <button @click="isUsageGuideVisible = true" class="help-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </nav>
      </header>

      <main>
        <div v-if="isLoading" class="status-message glass-panel">正在初始化...</div>
        <ReviewDeck v-else :cards="studySet" />
      </main>

      <transition name="fade">
        <FileUpload v-if="isUploadPanelVisible"
          @close="isUploadPanelVisible = false"
          @upload-success="handleUploadSuccess"
        />
      </transition>

      <transition name="fade">
        <UsageGuide v-if="isUsageGuideVisible" @close="isUsageGuideVisible = false" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FileUpload from './components/FileUpload.vue';
import ReviewDeck from './components/ReviewDeck.vue';
import UsageGuide from './components/UsageGuide.vue';
import { getReviewCards } from './api';

const studySet = ref([]);
const isLoading = ref(false);
const isUploadPanelVisible = ref(false);
const isUsageGuideVisible = ref(false);

const handleUploadSuccess = (cards) => {
  isUploadPanelVisible.value = false;
  studySet.value = cards;
};
</script>

<style>
/* 全局样式和核心布局 (与之前版本保持一致) */
:root {
  --primary-color: #0ea5e9; /* 我们的新帮手 */
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --text-light: #f8fafc;
  --text-dark: #1e293b;
  --panel-bg: rgba(255, 255, 255, 0.1);
  --panel-border: rgba(255, 255, 255, 0.2);
  --radius-lg: 1.5rem;
  --radius-md: 1rem;
}

@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

html { box-sizing: border-box; }
*, *:before, *:after { box-sizing: inherit; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #0f172a, #3730a3, #0ea5e9);
  background-size: 200% 200%;
  animation: gradient-animation 25s ease infinite;
  z-index: -1;
}

#app-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 3rem);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: var(--text-light);
}
.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
}
.main-nav button.upload-btn-header {
  padding: 0.6rem 1.5rem;
  border: none;
  background-color: var(--success-color);
  box-shadow: 0 2px 10px -2px var(--success-color);
  color: var(--text-light);
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.main-nav button.upload-btn-header:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.status-message {
  font-size: 1.25rem;
  font-weight: 500;
  color: #fff;
  text-align: center;
  padding: 3rem 1rem;
}

/* --- 【核心样式修改】 --- */
.main-nav {
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中 */
  gap: 0.75rem; /* 在按钮之间创建一些间距 */
}

.main-nav button.help-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;  /* 稍微增大尺寸 */
  height: 40px; /* 稍微增大尺寸 */
  padding: 0;
  border: none; /* 移除边框，让背景色更突出 */
  background-color: var(--primary-color); /* 使用主题蓝色 */
  box-shadow: 0 2px 10px -2px var(--primary-color); /* 添加阴影 */
  color: var(--text-light);
  border-radius: 999px; /* 保持圆形 */
  cursor: pointer;
  transition: all 0.2s ease;
}
.main-nav button.help-btn:hover {
  transform: translateY(-2px); /* 添加悬浮效果 */
  filter: brightness(1.1); /* 悬浮时提亮 */
}
/* --- 【核心样式修改结束】 --- */

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>