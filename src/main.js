/*
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 14:38:13
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-05-27 15:18:33
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
