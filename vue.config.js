'use strict'
const path = require('path')


function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    publicPath: '/',
    lintOnSave: false,
    configureWebpack: {

        resolve: {
            alias: {
                '@': resolve('src')
            }
        },


    },

}
