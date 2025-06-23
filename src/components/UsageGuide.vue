<template>
  <div class="guide-overlay" @click.self="$emit('close')">
    <div class="guide-panel" :class="{ 'is-visible': isVisible }">
      <button @click="$emit('close')" class="close-guide-btn">&times;</button>
      <h2>如何使用</h2>
      <p class="subtitle">本应用支持两种文档格式，助您轻松创建题库。</p>

      <div class="example-section">
        <h3>格式一：下划线格式</h3>
        <p>在Word文档中，直接为您想作为答案的文字添加下划线格式即可。</p>
        <div class="example-preview">
          法国的首都是<u>巴黎</u>。
        </div>
        <button @click="downloadExampleFile('example_underline.docx')" class="download-link">
          下载下划线表示例
        </button>
      </div>

      <div class="example-section">
        <h3>格式二：问答对格式</h3>
        <p>在问题行的下一行，以“答：”或“答案：”开头，列出所有答案，用顿号、逗号或空格隔开。</p>
        <div class="example-preview">
          <p>1. 世界上最高的山峰是_______，它位于_______洲。</p>
          <p>答：珠穆朗玛峰、 亚洲</p>
        </div>
        <button @click="downloadExampleFile('example_qa.docx')" class="download-link">
          下载问答对示例
        </button>
      </div>
      
      <p v-if="downloadMessage" class="message-text">{{ downloadMessage }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 【核心新增】: 导入 Capacitor 插件
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';

defineEmits(['close']);

const isVisible = ref(false);
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 10);
});

// 【核心新增】: 下载文件的完整逻辑
const downloadMessage = ref('');

const downloadExampleFile = async (filename) => {
  // 检查是否能使用分享功能
  const canShare = await Share.canShare();
  if (!canShare.value) {
      downloadMessage.value = '错误：此设备不支持分享功能。';
      return;
  }

  downloadMessage.value = `正在准备 ${filename}...`;

  try {
    // 1. 请求文件数据 (这部分不变)
    const response = await fetch(`https://aaii.pythonanywhere.com/api/example/${filename}`);
    if (!response.ok) throw new Error('网络响应错误');
    const blob = await response.blob();
    const base64Data = await convertBlobToBase64(blob);

    // 2. 【核心修改 2】: 将文件写入 App 的内部私有目录 (Directory.Data)
    // 这个目录是 App 专属的，总是可写，无需额外权限。
    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Data,
    });

    downloadMessage.value = `文件已准备好，正在调用分享...`;

    // 3. 【核心修改 3】: 使用 Share 插件分享已保存的文件
    // result.uri 是文件的本地路径，例如 "file:///..."
    await Share.share({
      title: '分享示例文件',
      text: `这是您请求的示例文件: ${filename}`,
      url: result.uri, // 分享文件的本地 URI
    });

    // 分享成功后清空消息
    downloadMessage.value = '';

  } catch (error) {
    // 如果用户取消了分享，可能会触发一个 "Share cancelled" 的错误，这是正常的
    if (error.message !== 'Share cancelled') {
        console.error('操作失败:', error);
        downloadMessage.value = `操作失败: ${error.message}`;
    } else {
        downloadMessage.value = '分享已取消。';
    }
  }
};

// 这是一个辅助函数，用于将 Blob 对象转为 Base64
const convertBlobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
</script>

<style scoped>
/* 你的原有样式保持不变 */
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}
.guide-panel {
  width: 90%;
  max-width: 400px;
  height: 100%;
  background: #f8fafc;
  color: var(--text-dark);
  padding: 2rem;
  padding-top: 4rem;
  box-shadow: -10px 0 30px rgba(0,0,0,0.2);
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  overflow-y: auto;
  position: relative;
}
.guide-panel.is-visible {
  transform: translateX(0);
}
.close-guide-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
}
h2 {
  margin-top: 0;
  font-size: 1.75rem;
}
.subtitle {
  color: #4b5563;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
}
.example-section {
  margin-bottom: 2.5rem;
}
.example-section h3 {
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.example-preview {
  background: #eef2f9;
  border-radius: var(--radius-md);
  padding: 1rem 1.5rem;
  font-family: 'Courier New', Courier, monospace;
}

/* 【核心修改】: 为 button 添加样式，让它看起来和之前的 a 链接一样 */
.download-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  /* 新增样式让 button 看起来像链接 */
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit; /* 继承父元素字体大小 */
}
/* 【核心新增】: 为下载消息提示添加样式 */
.message-text {
  margin-top: 1rem;
  font-size: 0.9em;
  color: #4b5563;
}
</style>