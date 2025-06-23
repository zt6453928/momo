<template>
  <div class="deck-wrapper">
    <!-- 如果有卡片，显示复习界面 -->
    <div v-if="cards.length > 0 && currentCard" class="deck-content-area">
      <div class="progress-container">
        <span>已完成: {{ completedInSession }} / {{ totalInSession }}</span>
        <div class="progress-bar">
          <div class="progress-bar-inner" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <div class="card-area">
        <transition name="card-slide" mode="out-in">
          <div :key="currentCard.uniqueId" class="card glass-panel-solid">
            <div class="question-text">{{ currentCard.content }}</div>
            <hr class="separator" :class="{ 'is-visible': isAnswerShown }" />
            <transition name="answer-reveal">
              <div v-if="isAnswerShown" class="answer-text-wrapper">
                <div class="answer-text">{{ currentCard.answer }}</div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>

    <!-- 如果没有卡片，显示欢迎界面 -->
    <div v-else class="no-cards-panel glass-panel">
      <h3>欢迎使用！</h3>
      <p>请点击顶部的“上传题库”按钮，开始您的第一次学习。</p>
    </div>

    <!-- 【布局修复】底部操作栏将不再是 fixed，而是作为flex布局的最后一部分 -->
    <div class="controls-footer">
      <div class="controls-footer-inner">
        <button
          v-if="!isAnswerShown"
          @click="isAnswerShown = true"
          class="show-answer-btn"
          :disabled="!currentCard"
        >
          显示答案
        </button>
        <div v-else class="actions-grid">
          <button @click="handleReview('forgot')" class="btn-forgot">忘记</button>
          <button @click="handleReview('fuzzy')" class="btn-fuzzy">模糊</button>
          <button @click="handleReview('know')" class="btn-know">认识</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { submitReviewResult } from '../api';

const props = defineProps({ cards: { type: Array, required: true } });

const reviewQueue = ref([]);
const isAnswerShown = ref(false);
const learningSteps = [1, 3];

watch(() => props.cards, (newCards) => {
  if (newCards && newCards.length > 0) {
    const queue = newCards.map(card => ({ ...card, status: 'new', step: 0, lapses: 0, uniqueId: `${card.id}-${Date.now()}` }));
    shuffleArray(queue);
    reviewQueue.value = queue;
  } else {
    reviewQueue.value = [];
  }
  isAnswerShown.value = false;
}, { immediate: true, deep: true });

const currentCard = computed(() => reviewQueue.value[0]);
const totalInSession = computed(() => props.cards.length);
const completedInSession = computed(() => totalInSession.value - reviewQueue.value.length);
const progressPercentage = computed(() => (totalInSession.value === 0) ? 0 : (completedInSession.value / totalInSession.value) * 100);

const shuffleArray = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } };

// 【核心逻辑修复】
const handleReview = (response) => {
  if (!currentCard.value) return;
  isAnswerShown.value = false;
  submitReviewResult(currentCard.value.id, response).catch(console.error);

  setTimeout(() => {
    const cardToProcess = reviewQueue.value.shift();

    if (response === 'forgot') {
      cardToProcess.status = 'learning';
      cardToProcess.step = 0;
      cardToProcess.lapses += 1;
      cardToProcess.uniqueId = `${cardToProcess.id}-${Date.now()}`;
      reviewQueue.value.splice(1, 0, cardToProcess);
    } else if (response === 'know') {
      if (cardToProcess.status === 'learning') {
        advanceStep(cardToProcess);
      }
    } else if (response === 'fuzzy') {
      cardToProcess.status = 'learning';
      advanceStep(cardToProcess);
    }
  }, 250);
};

const advanceStep = (card) => {
  const currentStepIndex = card.step;
  if (currentStepIndex < learningSteps.length) {
    const nextInterval = learningSteps[currentStepIndex];
    card.step += 1;
    card.uniqueId = `${card.id}-${Date.now()}`;
    const reinsertIndex = Math.min(reviewQueue.value.length, nextInterval);
    reviewQueue.value.splice(reinsertIndex, 0, card);
  }
};
</script>

<style scoped>
.deck-wrapper {
  width: 100%;
  /* 【布局修复】让deck-wrapper能弹性增长以填充main区域 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.deck-content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中卡片区域 */
  min-height: 0; /* flexbox hack for overflow */
}
.progress-container {
  color: var(--text-light);
  margin-bottom: 1rem;
  padding: 0 0.5rem;
  flex-shrink: 0; /* 防止被压缩 */
}
.progress-bar { background: rgba(0,0,0,0.2); border-radius: 999px; height: 6px; margin-top: 0.5rem; overflow: hidden; }
.progress-bar-inner { background: var(--primary-color); height: 100%; border-radius: 999px; transition: width 0.4s ease; }

.card-area {
  position: relative;
  margin: 1rem 0;
}

.card {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  transition: all 0.3s ease;
}
.glass-panel-solid {
  color: var(--text-dark);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2);
}

.question-text, .answer-text {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6;
  text-align: left;
  word-break: break-word;
  overflow-wrap: break-word;
  width: 100%;
}

.separator {
  width: 100%;
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5rem 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.separator.is-visible { opacity: 1; }
.answer-text-wrapper { overflow: hidden; }
.answer-text { color: var(--primary-color); }
.answer-reveal-enter-active { transition: all 0.4s ease-out; }
.answer-reveal-leave-active { transition: all 0.2s ease-in; }
.answer-reveal-enter-from, .answer-reveal-leave-to { transform: translateY(-10px); opacity: 0; max-height: 0; }

.card-slide-enter-active, .card-slide-leave-active { transition: all 0.3s ease; }
.card-slide-enter-from, .card-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.98); }

.no-cards-panel { text-align: center; color: var(--text-light); padding: 3rem 1.5rem; }
.no-cards-panel h3 { margin: 0 0 0.5rem 0; font-size: 1.5rem; }
.no-cards-panel p { margin: 0 0 1.5rem 0; opacity: 0.8; line-height: 1.6; }

/* 【布局修复】 */
.controls-footer {
  width: 100%;
  padding: 0; /* 外部容器不再需要padding */
  background: transparent;
  flex-shrink: 0;
  margin-top: auto; /* 将其推到底部 */
}
.controls-footer-inner {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  /* 移除毛玻璃效果，让按钮更清晰 */
}
.show-answer-btn, .actions-grid { width: 100%; margin: 0 auto; }
.show-answer-btn {
  display: block; width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: 600; border: none; border-radius: var(--radius-md);
  color: #fff; background: var(--primary-color); cursor: pointer;
  box-shadow: 0 4px 15px -5px var(--primary-color);
}
.show-answer-btn:disabled { background: #9ca3af; box-shadow: none; cursor: not-allowed; }
.actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.actions-grid button {
  padding: 1rem; font-size: 1.1rem; font-weight: 600; border: none; border-radius: var(--radius-md); color: white; cursor: pointer;
  box-shadow: 0 4px 15px -5px rgba(0,0,0,0.4);
}
.btn-forgot { background-color: var(--danger-color); }
.btn-fuzzy { background-color: var(--warning-color); }
.btn-know { background-color: var(--success-color); }

@media (max-width: 600px) {
  .card { padding: 1.5rem; }
  .question-text, .answer-text { font-size: 1.2rem; }
}
</style>