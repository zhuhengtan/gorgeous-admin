const path = require('path');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);

const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

module.exports = {
  devServer: {
    proxy: { //配置本地测试环境的代理，解决跨域
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
    plugins: [
      () => {
        if (process.env.REACT_APP_ENV === 'development') {
          console.log('开发环境，无需代码混淆')
          return null
        }
        const WebpackObfuscator = require('webpack-obfuscator')
        return new WebpackObfuscator({
          rotateStringArray: true
        }, [])
      }
    ]
  },
  babel: {
    plugins: [
      ['import', {
        libraryName: 'antd',
        style: true
      }],
      ['@babel/plugin-proposal-decorators', {
        legacy: true
      }],
    ],
  },
  loaders: [{
      test: lessRegex,
      exclude: lessModuleRegex,
      use: {
        loader: 'less-loader',
      },
      sideEffects: true,
    },
    {
      test: lessModuleRegex,
      use: {
        loader: 'less-loader',
      },
    },
  ],
  plugins: [{
      plugin: require("craco-less"),
    },
    {
      plugin: require('craco-plugin-scoped-css'),
    },
  ],
};