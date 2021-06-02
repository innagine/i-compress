/*
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 16:55:50
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-05-27 18:24:57
 */
import fs from 'fs'

// 创建目录，返回创建目录的结果
const mkdir = (path) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync( path )) { 
            resolve(true)
            return
        }
        fs.mkdir(path, (error) => {
            if (error) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}
export {
    mkdir,
}
