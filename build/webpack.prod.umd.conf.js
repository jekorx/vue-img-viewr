'use strict'
const merge = require('webpack-merge')
const prodWebpackConfig = require('./webpack.prod.conf')

module.exports = merge(prodWebpackConfig, {
  output: {
    filename: 'vue-img-viewr.umd.js',
    libraryTarget: 'window'
  }
})
