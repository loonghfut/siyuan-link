<template>
  <div id="app">
    <div class="header-container"> <!-- 添加一个新的容器 -->
      <h1 class="title">目标源笔记</h1>
      <button class="MY-refresh-button" @click="refreshPage()">刷新</button>
    </div>
    <div class="tree-container">
      <FileTree :items="fileTreeData" />
    </div>
    <!-- 实时展示 url, token, alistname, alistmima, alistUrl -->
    <!-- 当之变化时，实时更新 -->
    <div class="info-container">
      <p class="info-item">服务源: <span class="info-value">{{ serNum }}</span></p>
      <!-- 当selectedFileIdsName有值时，显示，否则不显示 -->
      <p v-if="selectedFileIdsName.length" class="info-item">已选笔记: <span class="info-value">{{ selectedFileIdsName }}</span></p>
      <p v-if="selectedFileIdsName.length" class="info-item"><button @click="plugin.pullNote(selectedFileIds)">拉取笔记</button></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import FileTree from './MyVue/FileTree.vue';
import { serNum } from '@/index';
import * as filetree from '@/FileTreeApi';
import {selectedFileIdsName ,selectedFileIds } from './MyVue/FileTree.vue';
export default {

  name: 'App',
  components: {
    FileTree
  },
  props: {
    plugin: Object // 接收 plugin 对象
  },
  setup() {

  },

  async mounted() {
    // console.log('mounted');
    // console.log(await filetree.getFileTreeData());
    // this.fileTreeData = await filetree.getFileTreeData();
  },
  methods: {

    async refreshPage() {
      this.serNum = serNum;
      // filetree.ceshi();
      const value2 = await filetree.getFileTreeData();
      console.log(value2);
      this.fileTreeData = value2
      // console.log(fileTreeData);
      // console.log(fileTreeData.value);
    },
  },
  data() {
    return {
      serNum,
      fileTreeData: ref([{ "name": "正在加载中。。。" }]),
      selectedFileIdsName,
      selectedFileIds,
      filetree,
      plugin: this.plugin,
    };
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #f6f8fa;
  /* background-color: #1e1e1e;
  min-height: 98%; */
  padding: 10px;
}

.tree-container {
  margin-left: -20px;
  /* 设置整体左移 */
  justify-content: flex-start;
  /* 或 'center'、'space-between' 等 */
  align-items: flex-start;
  /* 防止在垂直方向的溢出 */
  overflow: hidden;
  /* 隐藏不必要的滚动条 */

}

.title {
  color: #f6f8fa;
  font-size: 20px;
  margin-bottom: 20px;
}

.header-container {
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐元素 */
}

.title {
  margin-right: 30px;
  /* 给标题和按钮之间添加一点间隔 */
}

.MY-refresh-button {
  background: none;
  /* 按钮背景色 */
  color: white;
  /* 按钮文字颜色 */
  /* 加个边框 */
  border: 1px solid white;
  /* 字体大小 */
  font-size: 13px;
  margin-bottom: 20px;
  border-radius: 5px;
  /* 圆角效果 */
  /* padding: 2px 2px; 内边距 */
  cursor: pointer;
  /* 鼠标移动到按钮上时变为手型 */
  transition: background-color 0.3s ease;
  /* 添加过渡效果 */
}

.MY-refresh-button:hover {
  background-color: #0056b3;
  /* 悬停时的背景色 */
}

.info-container {
  background-color: #2e2e2e;
  /* 深色背景 */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
}

.info-item {
  font-size: 16px;
  color: #ccc;
  /* 浅色文本 */
}

.info-value {
  font-weight: bold;
  color: #61afef;
  /* 亮色值 */
}
</style>
