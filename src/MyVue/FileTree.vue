<template>
    <ul class="file-tree">
      <li v-for="item in items" :key="item.id" @click="toggle(item, $event)">
        <div :class="['tree-item', { expanded: item.expanded }]">
          <span class="icon">{{ item.type === 'folder' ? (item.expanded ? '📂' : '📁') : '📄' }}</span>
          <span class="name">{{ item.name }}</span>
        </div>
        <FileTree v-if="item.children && item.expanded" :items="item.children" />
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    name: 'FileTree',
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
      toggle(item, event) {
        if (item.type === 'folder') {
          item.expanded = !item.expanded;
        }
        event.stopPropagation();
      }
    }
  }
  </script>
  
  <style scoped>
  .file-tree {
    list-style-type: none;
    padding-left: 15px;
    color: #c0c0c0;
  }
  
  .tree-item {
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
  }
  
  .tree-item .icon {
    margin-right: 5px;
  }
  
  .tree-item.expanded {
    background-color: #333;
  }
  
  .name {
    margin-right: auto;
  }
  </style>
  