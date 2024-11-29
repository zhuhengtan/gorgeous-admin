import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import path from 'path'
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css'
import { visualizer } from 'rollup-plugin-visualizer'
import {
  CommonServerOptions, defineConfig, loadEnv, PluginOption,
} from 'vite'
import vitePluginRequire from 'vite-plugin-require'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/vite-env`, '')

  const prodEvn = loadEnv('production', `${process.cwd()}/vite-env`, '')

  //   if (mode === 'analysis') {
  //     plugins.push(
  //       visualizer({
  //         // 是否自动打开浏览器
  //         open: true,
  //         // 这里的 filename 是相对于 vite.config.ts 的
  //         filename: `dist/analysis.html`,
  //       })
  //     )
  //   }

  return {
    envDir: path.resolve(__dirname, './vite-env'),
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
        /* 处理 @import '~@/styles/constants.scss'; */
        {
          find: '~@',
          replacement: path.resolve(__dirname, './src'),
        },
        /**
         * 解决：[plugin:vite:css] '~antd/es/style/themes/index.less' wasn't found.
         * ref: https://github.com/ant-design/pro-components/issues/4880
         */
        {
          find: /^~/,
          replacement: '',
        },
      ],
      extensions: ['.ts', '.tsx', '.jsx', '.mjs', '.js', '.json'],
    },
    server: {
      host: true,
      port: 12138,
      open: true,
      hmr: true,
      // watch: {},
      proxy: {
        '/api': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      port: 12306,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    css: {
      modules: {
        scopeBehaviour: 'local',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {},
        less: {
          javascriptEnabled: true,
          // additionalData: '@root-entry-name: default;',
        },
      },
    },
    plugins: [
      /* 加 fastRefresh: false 配置可解决 vitejs/plugin-react can't detect preamble. Something is wrong. */
      // react({
      //   fastRefresh: false,
      // }),
      react(),
      reactScopedCssPlugin() as PluginOption,
      viteCommonjs(),
    ],
    build: {
      outDir: 'build',
      // assetsDir: 'assets', // 指定生成静态资源的存放路径（相对于 build.outDir），默认 assets。'' 可以去掉 assets 这一层目录，与之前 webpack 构建保持一致
      sourcemap: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          // ... 其他输出配置
          assetFileNames: 'assets/imgs/[name]-[hash][extname]',
          manualChunks: {
            react: ['react'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['prop-types'],
    },
  }
})
