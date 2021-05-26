const path = require('path')
const webpack = require('webpack')

const { NODE_ENV, PROJECT_TYPE, NEED_SOURCE_MAP } = process.env
const IS_DEV = NODE_ENV !== 'production'
const IS_DESIGNER = PROJECT_TYPE === 'designer' || PROJECT_TYPE === undefined
const pageMap = require('./src/router/config/page.js')

const minify = IS_DEV
  ? false
  : {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: false
  }

function resolve(dir) {
  return path.join(__dirname, dir)
}

function getChunkName(pathKey) {
  const pageName = pageMap[pathKey] || ''
  return pageName.split('.htm')[0]
}

const designerPage = {
  // flow: {
  //   title: '事务流设计器',
  //   entry: 'src/views/flow/main.js',
  //   template: 'public/flow.html',
  //   filename: pageMap.FLOW,
  //   chunks: ['chunk-vendors', 'chunk-common', getChunkName('FLOW')],
  //   minify
  // },
  // workflow: {
  //   title: '工作流设计器',
  //   entry: 'src/views/workFlow/main.js',
  //   template: 'public/workflow.html',
  //   filename: pageMap.WORKFLOW,
  //   chunks: ['chunk-vendors', 'chunk-common', getChunkName('WORKFLOW')],
  //   minify
  // },
  designer: {
    title: '可视化设计器',
    entry: 'src/views/designer/main.js',
    template: 'public/designer.html',
    filename: pageMap.DESIGNER,
    chunks: ['chunk-vendors', 'chunk-common', getChunkName('DESIGNER')],
    minify
  },
  preview: {
    title: '预览',
    entry: 'src/views/preview/main.js',
    template: 'public/preview.html',
    filename: pageMap.PREVIEW,
    chunks: ['chunk-vendors', 'chunk-common', getChunkName('PREVIEW')],
    minify
  }
}

const externals = {
  vue: 'Vue',
  monaco: 'monaco'
}
module.exports = {
  publicPath: IS_DEV ? '/' : './',
  pages: {
    index: {
      title: '首页',
      entry: 'src/views/index/main.js',
      template: 'public/index.html',
      filename: pageMap.INDEX,
      chunks: ['chunk-vendors', 'chunk-common', getChunkName('INDEX')],
      minify
    },
    ...(IS_DESIGNER ? designerPage : undefined)
  },
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://10.1.20.254:9902',
        // target: 'https://java.nti56.com',
        changeOrigin: true
      },
      '/websocket/*': {
        target: 'ws://10.1.21.3:8083',
        changeOrigin: true,
        pathRewrite: {
          '^/websocket': ''
        },
        ws: true // 开启ws, 如果是http代理此处可以不用设置
      }
    },
    // open: true, // 自动打开浏览器
    port: 8080,
    overlay: false
  },
  lintOnSave: 'warning',
  transpileDependencies: ['vue-particles', '@babel/parser'],
  productionSourceMap: NEED_SOURCE_MAP === 'true',
  configureWebpack: {
    externals,
    resolve: {
      extensions: ['.js', '.vue', '.scss'],
      alias: {
        '@': resolve('./src'),
        '@assets': resolve('./src/assets'),
        '@style': resolve('./src/styles'),
        '@utils': resolve('./src/utils'),
        '@router': resolve('./src/router'),
        '@store': resolve('./src/store'),
        '@views': resolve('./src/views'),
        '@components': resolve('./src/components')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
        'process.env.IS_ENCRYPT': JSON.stringify(process.env.IS_ENCRYPT || ''),
        'process.env.NEED_SOURCE_MAP': JSON.stringify(NEED_SOURCE_MAP || ''),
        'process.env.PROJECT_TYPE': JSON.stringify(PROJECT_TYPE || '')
      })
    ]
  },
  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude
      .add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 移除 prefetch 插件
    config.plugins.delete('prefetch-index')
    // config.plugins.delete('prefetch-designer')
    config.plugins.delete('prefetch-preview')

    if (!IS_DEV) {
      config.optimization.splitChunks({
        cacheGroups: {
          common: {
            name: 'chunk-common',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          split: {
            name: 'chunk-split',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'async',
            maxInitialRequests: Infinity,
            minSize: 300000,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
            // eslint-disable-next-line no-dupe-keys
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      })
    }
  }
}
