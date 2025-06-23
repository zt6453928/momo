# 墨墨背填空

> 用背单词的方式背填空。

[![前端: Vue.js](https://img.shields.io/badge/Frontend-Vue.js-4FC08D)](https://vuejs.org/)
[![后端: Python/Flask](https://img.shields.io/badge/Backend-Python/Flask-3776AB)](https://flask.palletsprojects.com/)
[![移动端: Capacitor](https://img.shields.io/badge/Mobile-Capacitor-119EFF)](https://capacitorjs.com/)

“墨墨背填空”是一款智能的填空题复习工具。它的灵感来源于我在准备期末考试时，希望能像使用“墨墨背单词”软件一样，科学、高效地复习知识点。传统的复习方式难以追踪记忆进度，而此应用旨在将你的 Word 笔记一键转换成随身的、可随时复习的记忆卡片，希望能帮助到每一位在学习道路上努力前行的同学。

<p align="center">
  <img src="https://i.ibb.co/RG9hVv46/download.png" alt="App Screenshot" width="300"/>
</p>


---

## ✨ 功能特性

* **智能导入**：支持从 `.docx` Word 文档一键导入题库，自动解析题目和答案。
* **格式兼容**：同时支持“**下划线格式**”和“**问答对格式**”两种主流笔记格式，无需改变你的笔记习惯。
* **跨平台复习**：提供 Web 版本和原生安卓 App，让你可以在桌面端和移动端随时随地进行复习。
* **纯净体验**：简洁、无广告的复习界面，让你能专注于学习本身。
* **未来规划**：即将加入基于艾宾浩斯记忆曲线的智能复习算法，科学安排你的复习计划。

<p align="center">
  <img src="https://i.ibb.co/1tH2P2bW/Wechat-IMG377.jpg" alt="App Screenshot" width="300"/>
</p>

## 🚀 线上体验

你可以通过以下地址访问 Web 版本的应用：

[**https://aaii.pythonanywhere.com/**](https://aaii.pythonanywhere.com/)

## 🛠️ 技术栈

* **前端**: Vue.js (Vue 3), Vite, Axios
* **后端**: Python, Flask, Flask-SQLAlchemy
* **数据库**: SQLite
* **移动端封装**: Capacitor
* **Word 文档解析**: python-docx

## 💻 本地开发指南

如果你想在本地运行或参与开发，请遵循以下步骤：

### 先决条件

* [Node.js](https://nodejs.org/) (v16+)
* [Python](https://www.python.org/) (v3.8+)
* Git

### 安装与运行

1.  **克隆仓库**
    ```bash
    git clone [https://github.com/zt6453928/momo.git](https://github.com/zt6453928/momo.git)
    cd momo
    ```

2.  **设置后端**
    ```bash
    # 进入后端目录（假设你的后端代码和前端在一个仓库）
    # cd backend  # 如果你的后端在单独的文件夹
    
    # 创建并激活 Python 虚拟环境
    python3 -m venv venv
    source venv/bin/activate  # on Mac/Linux
    # venv\Scripts\activate  # on Windows
    
    # 安装 Python 依赖
    pip install -r requirements.txt
    
    # 初始化数据库
    flask db upgrade
    
    # 运行后端服务器 (通常在 5000 端口)
    flask run
    ```

3.  **设置前端**
    ```bash
    # 进入前端目录
    cd frontend
    
    # 安装 npm 依赖
    npm install
    
    # 启动本地开发服务器 (通常在 5173 端口)
    npm run dev
    ```
    现在，你可以在浏览器中打开 `http://localhost:5173` 来访问本地开发版的前端了。

## 📱 打包移动端 App

1.  确保你已安装 [Android Studio](https://developer.android.com/studio) 和必要的安卓 SDK。
2.  在 `frontend` 目录下，运行以下命令来打包和同步资源：
    ```bash
    # 打包 Web 资源
    npm run build
    
    # 将 Web 资源同步到安卓项目
    npx cap sync
    ```
3.  用 Android Studio 打开安卓项目：
    ```bash
    npx cap open android
    ```
4.  在 Android Studio 中，你可以将 App 运行到模拟器或连接的真机上。

## 👨‍💻 作者

* **zt6453928** - [GitHub Profile](https://github.com/zt6453928)
