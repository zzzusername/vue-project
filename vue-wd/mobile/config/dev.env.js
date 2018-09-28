var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CDN_DOMAIN: '"http://img.junheyang.com"',
  API_URL: '"http://www.junheyang.com/user"',
  IS_SHOW_SWITCH_USER: true
})