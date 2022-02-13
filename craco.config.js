const path = require('path');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);

module.exports = {
  devServer: {
    proxy: {//配置本地测试环境的代理，解决跨域
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    },
  },
  webpack: {
    alias: {
      '@': pathResolve('src'),
      // 此处是一个示例，实际可根据各自需求配置
    },
  },
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', style: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  },
  plugins: [
    {
      plugin: require("craco-less"),
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              'primary-color': '#f18101',
              'link-color': '#f18101',
            },
            javascriptEnabled: true,
          }
        }
      }
    },
    {
      plugin: require('craco-plugin-scoped-css'),
    },
  ],
};
