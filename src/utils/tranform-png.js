/*
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 17:02:04
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-06-03 00:30:44
 */
import { nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'
import { mkdir } from './utils'

const transformPNG = (input, quality) => {
    quality = quality || 50
    const image = nativeImage.createFromPath(input);
    const imageData = image.toPNG()
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
            const data = transformPNG(item, options.quality)
            const targetDir = `${options.targetDir}${path.sep}${dirParse.name}.png`
            fs.writeFileSync(targetDir,data)
        })
        return {
            success: true,
            msg: `图片转换成功，保存在 ${options.targetDir} 目录中`
        }
    } catch (err) {
        console.log(err, 'err')
        return {
            success: false,
            msg: `图片转换失败!`,
            reason: err
        }
    }
}
