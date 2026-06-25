const path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const generate = require('@ant-design/colors/lib/generate').default

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // generate theme color replacement styles
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getAntdSerials('#2f54eb'), // primary color series

        // change style selectors to solve style override issues
        changeSelector(selector) {
          switch (selector) {
            case '.ant-calendar-today .ant-calendar-date':
              return ':not(.ant-calendar-selected-date):not(.ant-calendar-selected-day)' + selector
            case '.ant-btn:focus,.ant-btn:hover':
              return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)'
            case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
              return ':not(.ant-steps-item-process)' + selector
            case '.ant-btn.active,.ant-btn:active':
              return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)'
            case '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover':
            case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
              return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover'
            case '.ant-menu-horizontal > .ant-menu-item-selected > a':
              return ':not(.ant-menu-horizontal)' + selector
            case '.ant-menu-horizontal > .ant-menu-item > a:hover':
              return ':not(.ant-menu-horizontal)' + selector
            default:
              return selector
          }
        }
      })
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#2f54eb',
          'body-background': '#141414',
          'component-background': '#1f1f1f',
          'layout-body-background': '#141414',
          'layout-header-background': '#1f1f1f',
          'layout-sider-background': '#1f1f1f',
          'border-color-base': '#303030',
          'border-color-split': '#303030',
          'item-hover-bg': '#262626',
          'text-color': 'rgba(255, 255, 255, 0.85)',
          'text-color-secondary': 'rgba(255, 255, 255, 0.45)',
          'disabled-color': 'rgba(255, 255, 255, 0.25)',
          'input-bg': '#262626',
          'select-background': '#262626',
          'tooltip-bg': '#434343',
          'popover-bg': '#2d2d2d',
          'modal-content-bg': '#1f1f1f',
          'card-background': '#1f1f1f',
          'table-bg': '#1f1f1f',
          'table-header-bg': '#262626',
          'table-row-hover-bg': '#262626',
          'table-selected-row-bg': '#2a3554',
          'menu-dark-bg': '#1f1f1f',
          'menu-dark-submenu-bg': '#141414',
        },
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/style/static.less')]
    }
  },
  devServer: {
    disableHostCheck: true,
    port: process.env.DEV_PORT || 8000
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

function getAntdSerials(color) {
  // Lighten (similar to less's tint)
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  const colorPalettes = generate(color)
  return lightens.concat(colorPalettes)
}
