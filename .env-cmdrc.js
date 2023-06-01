module.exports = {
  development: {
    REACT_APP_API_HOST: 'https://development.xxx.com',
    REACT_APP_SIGN_KEY: 'gorgeous-admin-server',
    GENERATE_SOURCEMAP: true
  },
  ready: {
    REACT_APP_API_HOST: 'https://production.xxx.com',
    REACT_APP_SIGN_KEY: 'gorgeous-admin-server',
    GENERATE_SOURCEMAP: true
  },
  pre: {
    REACT_APP_API_HOST: 'https://production.xxx.com',
    REACT_APP_SIGN_KEY: 'gorgeous-admin-server',
    GENERATE_SOURCEMAP: true
  },
  prd: {
    REACT_APP_API_HOST: 'https://production.xxx.com',
    REACT_APP_SIGN_KEY: 'gorgeous-admin-server',
    GENERATE_SOURCEMAP: false
  }
}