module.exports = {
  devServer: {
    port: 2436
    // proxy: {
    // '/geoserver': {
    //   target: 'http://118.190.202.102:6072/geoserver/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/geoserver': ''
    //   }
    // }
    // }
  },
  productionSourceMap: false,
  // pluginOptions: {
  //   proxy: {
  //     '/geoserver': {
  //       target: 'http://118.190.202.102:6072/geoserver/',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/geoserver': ''
  //       }
  //     }
  //   }
  // },
  outputDir: 'police'
}
