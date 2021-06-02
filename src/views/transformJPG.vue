<!--
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-06-02 16:35:18
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-06-03 00:34:03
-->
<!--
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 14:38:13
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-06-02 16:18:18
-->
<template>
  <div class="tinypng-wrapper">
    <div class="tips">
      <p>1. 将png格式图片 <span class="highlight">jpg</span> 格式图片；</p>
      <p>2. 一次最多转换<span class="highlight">100张</span>；</p>
      <p>
        3. 转换后的文件会保存在<span class="highlight"
          >选择的路径下的transfromJPG文件夹</span
        >中, 请留意成功后的提示；
      </p>
      <p>
        4. transfromJPG文件夹中如果有同名文件，将被<span class="highlight"
          >覆盖</span
        >；
      </p>
      <p>5. 图片处理需要时间，点击转换后请耐心等待片刻。</p>
    </div>
    <div class="header">
      <input type="file" id="file" @change="fileChange" hidden webkitdirectory>
      <el-input placeholder="保存文件目录" v-model="targetDir" disabled>
        <template #prepend>图片保存目录</template>
        <template #append>
          <el-button icon="el-icon-folder" @click="btnChange"></el-button>
        </template>
      </el-input>
      <el-button style="margin-left: 24px" type="primary" @click="handleSubmit"
        >开始转换</el-button
      >
    </div>
    <div class="tinypng-content">
      <el-upload
        class="upload-demo"
        ref="upload"
        accept=".jpg,.png"
        multiple
        :auto-upload="false"
        :limit="maxFileNum"
        :file-list="fileList"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        action=""
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tinypng-wrapper{
  width: 96%;
  margin: 0 auto;
  .tips{
    padding-left: 20px;
    border: 1px dashed rgb(187, 187, 187);
    .highlight{
      color: rgb(84, 162, 252);
    }
  }
  .header{
    display: flex;
    align-items:center;
    justify-content: space-between;
    margin-top: 25px;
    .slider{
      width: 78%;
      margin-right: 20px;
    }
  }
  .tinypng-content{
    margin: 20px 0;
    padding: 20px;
    border: 1px dashed rgb(187, 187, 187);
    border-radius: 5px;
  }
}
</style>

<script>
// electron ipcRenderer -- 与electron主进程通信
const { ipcRenderer } = window.require("electron")
// path模块，处理文件路径
const PATH = window.require("path");

import { onMounted, ref, onBeforeUnmount } from "vue";
import { ElMessage, ElNotification, ElLoading } from "element-plus";
// loading 实例
 let loadingInstance = null;

export default {
  setup() {
    // 文件列表
    const fileList = ref([]);
    // 批量处理文件数量限制
    const maxFileNum = ref(100);
    // 图片选择组件
    const upload = ref(null);
    // 图片保存的目标目录
    const targetDir = ref(null);
    // 图片压缩质量
    const quality = ref(50);
    // 弹窗显示控制
    const dialogVisible = ref(false);
    // 弹窗图片链接
    const dialogImageUrl = ref(null);
    // 图片压缩质量选项
    const marks = ref({
      10: "10",
      20: "20",
      30: "30",
      40: "40",
      50: "50",
      60: "60",
      70: "70",
      80: "80",
      90: "90",
      100: "100"
    });

    // 文件选择数量超出设定值时，弹出警告框
    const handleExceed = (files, fileList) => {
        ElMessage.warning({
            message: `最多只能选择 ${ maxFileNum.value }个文件哦，当前选择了 ${files.length + fileList.length} 个文件`,
            type: "warning"
        });
      
    };

    // 确认按钮，开始压缩
    const handleSubmit = () => {
      const uploadFiles = upload.value.uploadFiles;
      // 验证是否选择了图片，没有选择弹出警告信息
       if (!uploadFiles.length) {
        ElNotification({
          title: "警告",
          message: "请先选择文件！", 
          type: "warning"
        });
        return false;
      }
      // 验证是否选择了路径，没有选择弹出警告信息
       if (!targetDir.value) {
        ElNotification({
          title: "警告",
          message: "请先选择文件存放路径！", 
          type: "warning"
        });
        return false;
      }
	
      const dir = PATH.normalize(targetDir.value);

      // 遍历出图片文件的路径
      const fileList = [];
      uploadFiles.map(item => item?.raw?.path && fileList.push(item.raw.path));
      
      // 消息参数
      const data = {
        fileList,
        quality: quality.value,
        targetDir: dir
      };
      
      // 显示loading
      loadingInstance = ElLoading.service( {
        background: "rgba(255,255,255,0.5)"
      });
        
     // 向主进程发送消息，消息中有：压缩质量、压缩保存目录、压缩文件的地址（数组）
     ipcRenderer.send("transform-jpg", data);
    };

    // 选择文档路径
    const btnChange = () => {
      var file = document.getElementById('file')
      file.click()
    };

    // 文件路径改变时
    const fileChange = () => {
      try {
        const fu = document.getElementById('file')
        if (fu == null) return
        targetDir.value = PATH.parse(fu.files[0].path).dir+ `${PATH.sep}transformJPG`
        console.log(targetDir.value)
      } catch (error) {
        console.debug('choice file err:', error)
      }
    };

    const handlePictureCardPreview = file => {
      console.log('file.url',file.url)
      ElNotification({
        title: "通知",
        message: "预览图片功能暂不支持"
      });
    }

    onBeforeUnmount(() => {
      loadingInstance = null;
    });

    // mounted 生命周期
    onMounted(() => {
    // 响应主进程推送的图片压缩状态，并弹框显示
          ipcRenderer.on("jpg-status", (event, arg) => {
        ElNotification({
            title: arg.success ? "成功" : "失败",
            message: arg.success ? arg.msg : arg.reason,
            type: arg.success ? "success" : "error"
        });
        loadingInstance.close();
        if (arg.success) {
          upload.value.uploadFiles = [];
          fileList.value = [];
          quality.value = 50;
          // targetDir.value = null;
        }

    });
    });

    return {
      targetDir,
      upload,
      quality,
      marks,
      fileList,
      maxFileNum,
      handleExceed,
      handleSubmit,
      btnChange,
      fileChange,
      handlePictureCardPreview,
      dialogVisible,
      dialogImageUrl
    };
  }
};
</script>
