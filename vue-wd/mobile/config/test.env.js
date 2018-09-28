var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"development"',
  CDN_DOMAIN: '"http://img.junheyang.com"',
  API_URL: '"/user"',
  IS_SHOW_SWITCH_USER: true
})
