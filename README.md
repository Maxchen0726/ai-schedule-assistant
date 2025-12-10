# ai-schedule-assistant
# 🧠 AI Schedule Assistant  
一个基于 **Django + React + TailwindCSS + Gemini AI** 的智能日程管理助手。

AI 日程助手可以帮助你记录每日事件、查看统计信息，并基于你的学习/工作节奏自动生成个性化生活建议。

## 🚀 功能特性

### ✔️ 智能分析你的日程  
- 自动读取你当天的所有事件  
- 使用 **Gemini 2.5 Flash** 生成 3–5 条生活建议  
- 内容涵盖效率、规划、休息、健康节奏等  

### ✔️ 事件管理（后端 Django）  
- 创建 / 删除 / 查看每日事件  
- 用户登录系统（Django Auth）  
- 每个用户拥有独立的数据空间  

### ✔️ 现代化前端（React + TailwindCSS）  
- 清爽的 Dashboard  
- 今日事件、AI 建议整合在同一页面  
- 响应式布局，适配桌面与移动  

### ✔️ 安全的 API Key 管理  
- 使用环境变量存储 GEMINI_API_KEY  
- `.gitignore` 已排除虚拟环境、本地配置等敏感文件  
- 仓库公开但不包含任何私密信息  

---

## 🏗️ 技术栈

### **Backend (Django REST Framework)**
- Django 5
- Django REST Framework
- Python-dotenv / 环境变量 API Key 管理
- Gemini 官方 Python SDK（`google-genai`）

### **Frontend (React + TailwindCSS + Vite)**
- React 18
- Vite 构建工具
- TailwindCSS  
- Axios —— 与 Django 后端通信

---

## 📦 本地运行

### 1️⃣ 克隆项目
```bash
git clone https://github.com/Maxchen0726/ai-schedule-assistant.git
cd ai-schedule-assistant
