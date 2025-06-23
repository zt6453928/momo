// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa' // 1. 导入插件

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 2. 添加 PWA 插件的配置
    VitePWA({
      registerType: 'autoUpdate', // 配置更新策略，'autoUpdate' 会自动更新
      devOptions: {
        enabled: true // 允许在开发环境下也启用 PWA 功能，方便调试
      },
      manifest: {
        // 这个清单文件定义了你的 App 的所有元数据
        name: '墨墨背填空',
        short_name: '墨墨背填空',
        description: '一个用于高效复习和背诵填空题的应用。',
        theme_color: '#3730a3', // App 的主题颜色，会影响安卓状态栏颜色
        background_color: '#0f172a', // App 的启动闪屏背景色
        display: 'standalone', // 让 App 以独立窗口模式运行，隐藏浏览器UI
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // 图标路径，相对于 public 文件夹
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // 'maskable' 图标可以更好地适应不同形状的图标
          }
        ]
      }
    })
  ],
})