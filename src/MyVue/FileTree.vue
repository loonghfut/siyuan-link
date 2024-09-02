<template>
  <ul class="file-tree">
    <li v-for="item in items" :key="item.id" @click="toggle(item, $event)">
      <div :class="['tree-item', { expanded: item.expanded, selected: selectedFileIds.includes(item.id) }]">
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
  data() {
    return {
      selectedFileId: [],
    };
  },
  methods: {
    toggle(item, event) {
      if (item.type === 'folder') {
        item.expanded = !item.expanded;
      }
      const index = this.selectedFileIds.indexOf(item.id);
      if (index === -1) {
        this.selectedFileIds.push(item.id);
      } else {
        this.selectedFileIds.splice(index, 1);
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
.tree-item.selected {
  background-color: #7498f4; /* 你可以根据需要调整颜色 */
}
</style>