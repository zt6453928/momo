import axios from 'axios';

const apiClient = axios.create({
  // 【核心修改】从环境变量中读取 baseURL
  baseURL: 'https://aaii.pythonanywhere.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 只保留需要的 API 函数
export const getReviewCards = () => {
  return apiClient.get('/reviews');
};

export const submitReviewResult = (questionId, response) => {
  return apiClient.post('/submit_review', { /* ... */ });
};

export const resetWithFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/reset_with_document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAllQuestions = () => {
  return apiClient.get('/questions');
};