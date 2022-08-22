'use strict'
const merge = require('webpack-merge')
const prodWebpackConfig = require('./webpack.prod.conf')

module.exports = merge(prodWebpackConfig, {
  output: {
    filename: 'vue-img-viewr.cjs.js',
    libraryExport: 'default',
    libraryTarget: 'commonjs2'
  }
})
