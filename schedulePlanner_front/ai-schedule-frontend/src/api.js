// src/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // 根据你的后端改

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 在每个请求前自动加 Authorization 头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ⭐ 新增：响应拦截器，统一处理 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清理本地 token
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // 写一个标记，告诉登录页这是“会话过期”
      localStorage.setItem("session_expired", "1");

      // 简单粗暴：刷新页面，让 App 回到登录状态
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;