const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  // Configurazione server di sviluppo
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: 'all',
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true
      }
    }
  },
  // Configurazione Webpack
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      })
    ],
    // Configurazione per ottimizzare i bundle
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000
      }
    }
  },
  // Opzioni di compilazione CSS
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer')
          ]
        }
      }
    }
  }
})
