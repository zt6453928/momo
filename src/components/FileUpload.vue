<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-panel glass-panel">
      <h3>上传题库</h3>
      <p>选择一个 .docx 文件，应用将自动识别带下划线的填空题，并重置您当前的题库。</p>

      <label for="file-upload" class="submit-btn">{{ submitButtonText }}</label>

      <input id="file-upload" type="file" @change="handleFileChange" accept=".docx" style="display: none;" />

      <p v-if="message" class="message-text">{{ message }}</p>

      <button @click="$emit('close')" class="close-btn">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { resetWithFile } from '../api';

// 【核心修改 3】: 不再需要 fileInput ref
// const fileInput = ref(null);
const message = ref('');
const submitButtonText = ref('上传并重置');

const emit = defineEmits(['close', 'upload-success']);

// 【核心修改 4】: 不再需要 triggerFileInput 函数，可以完全删除
// const triggerFileInput = () => {
//   fileInput.value.click();
// };

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  submitButtonText.value = '上传中...';
  message.value = '';

  try {
    const response = await resetWithFile(file);
    message.value = `操作成功！添加了 ${response.data.length} 个新题目。`;
    submitButtonText.value = '上传成功 ✔';
    setTimeout(() => {
      emit('upload-success', response.data);
    }, 1500);
  } catch (error) {
    message.value = '操作失败: ' + (error.response?.data?.error || error.message);
    submitButtonText.value = '上传失败 ✖';
  } finally {
    setTimeout(() => {
      submitButtonText.value = '上传并重置';
    }, 2000);
    event.target.value = '';
  }
};
</script>

<style scoped>
/* 样式完全保持不变，但现在 submit-btn 的样式会应用在 label 上 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 1rem;
}
.modal-panel {
  color: var(--text-light);
  width: 100%;
  max-width: 450px;
  text-align: center;
}
.modal-panel.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  border-radius: var(--radius-lg);
}
h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}
p {
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
  font-size: 0.9rem;
  line-height: 1.5;
}
.submit-btn {
  /* 这些样式现在会应用到 <label> 上，让它看起来和按钮一样 */
  display: inline-block; /* 添加这个可以让 label 表现得像按钮 */
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  color: #fff;
  background: var(--success-color);
  box-sizing: border-box; /* 确保 padding 不会撑大宽度 */
}
.message-text {
  min-height: 1.2em;
  font-weight: 500;
  margin-top: 1rem;
}
.close-btn {
  margin-top: 1.5rem;
  background: none;
  border: none;
  color: var(--text-light);
  opacity: 0.7;
  cursor: pointer;
}
</style>