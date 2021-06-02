/*
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 14:38:13
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-06-02 16:51:54
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import ImageCompress from '../views/ImageCompress.vue'
import transformPNG from '../views/transformPNG.vue'
import transformJPG from '../views/transformJPG.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/first'
  },
  {
    path: '/first',
    name: 'ImageCompress',
    component: ImageCompress
  },
  {
    path: '/second',
    name: 'transformPNG',
    component: transformPNG
  },
  {
    path: '/third',
    name: 'transformJPG',
    component: transformJPG
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
