const webpack = require('webpack')

module.exports = {
  webpack:{
    plugins: {
      add: [
        new webpack.ProvidePlugin({
        }),
      ]
    },
    configure: {
      resolve: {
        fallback: {

        }
      }
    },
  },
  devServer: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' fonts.googleapis.com 'unsafe-inline'; font-src 'self' fonts.gstatic.com; script-src 'self'; connect-src 'self' http://localhost:3003; img-src *; base-uri 'self'; form-action 'self'; frame-src 'self'; object-src 'none'; media-src 'none'; frame-ancestors 'self';"
    }
  }
}
