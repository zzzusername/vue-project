'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CDN_DOMAIN: '"http://img.junheyang.com"',
  API_URL: '"http://www.junheyang.com/user"',
  IS_SHOW_SWITCH_USER: true
})
