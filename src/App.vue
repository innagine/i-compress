<!--
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 14:38:13
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-06-02 17:08:15
-->
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
    <el-tab-pane label="图片压缩" name="first"></el-tab-pane>
    <el-tab-pane label="转换PNG" name="second"></el-tab-pane>
    <el-tab-pane label="转换JPG" name="third"></el-tab-pane>
  </el-tabs>
  <router-view/>
</template>

<style lang="scss">
body{
  margin: 0;
  padding: 0;
  background: linear-gradient(to right, #f1f1f1, #ffffff);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #868585;
  .tabs{
    width: 96%;
    margin: 0 auto;
  }
}
</style>

<script>
import { ref } from 'vue'
import { useRouter } from "vue-router";
export default {
  setup(){
    const activeName = ref(null);
    const router = useRouter();
    const handleClick = () =>{
      let path = '/'+activeName.value
      router.push(path)
    }
    return {
      activeName,
      handleClick
    }
  }
}
</script>