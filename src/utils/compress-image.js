/*
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 17:02:04
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-05-27 18:19:45
 */
import { nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'
import { mkdir } from './utils'

const imageCompress = (input, quality) => {
    quality = quality || 50
    const image = nativeImage.createFromPath(input);
    const res = image.resize({
        // 图片压缩质量，可选值：better || good || best
        quality: 'best'  
    })
    console.log(res)
    // const imageData = res.toPNG()
    // jpg 压缩 图片质量设置
    const imageData = res.toJPEG(quality)
    return imageData;
}

export default async (options) => {
    // 创建保存图片目录，失败的话退出
    const createDir = await mkdir(options.targetDir)
    if (!createDir) return {
        success: false,
        msg: '创建图片保存目录失败！'
    } 

    try {
        options.fileList.map((item) => {
            const dirParse = path.parse(item)
            const data = imageCompress(item, options.quality)
            const targetDir = `${options.targetDir}${path.sep}${dirParse.name}${dirParse.ext}`
            fs.writeFileSync(targetDir,data)
        })
        return {
            success: true,
            msg: `图片压缩成功，保存在 ${options.targetDir} 目录中`
        }
    } catch (err) {
        console.log(err, 'err')
        return {
            success: false,
            msg: `图片压缩失败!`,
            reason: err
        }
    }
}
