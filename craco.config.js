const webpack = require('webpack')

module.exports = {
  webpack:{
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer/index.js', 'Buffer'],
        }),
      ]
    },
    configure: {
      resolve: {
        fallback: {

        }
      }
    }
  }
}