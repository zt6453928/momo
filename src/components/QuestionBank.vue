<template>
  <div class="bank-container glass-panel">
    <h2>我的总题库 ({{ questions.length }}条)</h2>
    <div v-if="isLoading" class="loading-text">正在加载题库...</div>
    <ul v-else class="question-list">
      <li v-for="q in questions" :key="q.id">
        <span>{{ q.content.replace(' [___]', ` [${q.answer}]`) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
// The <script> part remains unchanged.
import { ref, onMounted } from 'vue';
import { getAllQuestions } from '../api';
const questions = ref([]);
const isLoading = ref(true);
onMounted(async () => {
  try {
    const response = await getAllQuestions();
    questions.value = response.data;
  } catch (error) {
    console.error('获取题库失败:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.bank-container.glass-panel {
  color: var(--text-dark); /* 同样使用深色文字保证可读性 */
  background: rgba(255, 255, 255, 0.6);
}
.loading-text {
  text-align: center;
  padding: 2rem 0;
  font-size: 1.1rem;
}
h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}
.question-list {
  list-style-type: decimal;
  padding-left: 1.5rem;
  max-height: 60vh; /* 增加最大高度和滚动条 */
  overflow-y: auto;
}
li {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  line-height: 1.5;
}
li:last-child {
  border-bottom: none;
}
</style>