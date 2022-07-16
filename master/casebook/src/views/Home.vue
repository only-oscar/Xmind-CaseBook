<template>
  <div class="admin-container">
    <el-container class="custom-height">
      <el-menu
        :collapse="isCollapse"
        :default-active="route.meta.index"
        class="el-menu-vertical"
        @select="selectMenu"
      >
        <div class="menu-title">
          <div id="menu" @click="toggleCollapse">
            <svg-icon icon-class="expand" class-name="icon"></svg-icon>
          </div>
        </div>
        <template v-for="item in menus" :key="item.index">
          <el-menu-item v-if="!item.isSub" :index="item.index">
            <svg-icon
              :icon-class="item.icon"
              :class-name="activeIndex == item.index ? 'activeIcon' : ''"
              class="icon"
            ></svg-icon>
            <template #title>{{ item.name }}</template>
          </el-menu-item>
          <el-sub-menu v-if="item.isSub" :index="item.index">
            <template #title>
              <svg-icon
                :icon-class="item.icon"
                :class-name="activeIndex == item.index ? 'activeIcon' : ''"
                class="icon"
              ></svg-icon>
              <span>{{ item.name }}</span>
            </template>

            <el-menu-item
              v-for="child in item.children"
              :index="child.index"
              :key="child.index"
            >
              <template #title>{{ child.name }}</template>
              <svg-icon
                :icon-class="child.icon"
                :class-name="activeIndex == child.index ? 'activeIcon' : ''"
                class="icon"
              ></svg-icon>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
      <el-container class="right">
        <el-header class="custom-header">
          <div id="header-title">{{ activeName }}</div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
// 菜单栏
const menus = ref([
  {
    name: '后端数据处理',
    index: '1',
    path: '/after-end',
    icon: 'after',
    isSub: false
  },
  {
    name: '前端数据处理',
    index: '2',
    path: '/front-end',
    icon: 'front',
    isSub: false
  }
])
// 菜单栏是否折叠
const isCollapse = ref(false)
// 创建路由导航
const router = useRouter()
const route = useRoute()
// 当前选中的菜单项名称
const activeName = ref(route.meta.title)
// 当前选中的菜单项索引值，默认为1
const activeIndex = ref(route.meta.index)

function getObject (arr, indexArr) {
  for (let i = 0; i < indexArr.length; i++) {
    if (i === indexArr.length - 1) {
      arr = arr[indexArr[i] - 1]
    } else {
      arr = arr[indexArr[i] - 1].children
    }
  }
  return arr
}

function selectMenu (index) {
  let path
  activeIndex.value = index
  const strArr = index.split('-')
  if (strArr.length > 1) {
    const activeMenu = getObject(menus.value, strArr)
    activeName.value = activeMenu.name
    path = `${activeMenu.path}`
  } else {
    activeName.value = menus.value[index - 1].name
    path = `${menus.value[index - 1].path}`
  }
  router.push({ path })
}
// 切换展开折叠菜单栏
function toggleCollapse () {
  isCollapse.value = !isCollapse.value
}
</script>

<style>
.el-container {
  flex-basis: 0;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px !important;
}
</style>
<style lang="less" scoped>
.admin-container {
  height: 100%;
}

// .el-menu-vertical:not(.el-menu--collapse) {
//   width: 220px !important;
// }

.icon {
  margin-right: 10px;
}
.activeIcon {
  fill: var(--el-menu-active-color);
  stroke: var(--el-menu-active-color);
}
.custom-height {
  height: inherit;
}

.menu-title {
  display: flex;
  height: 60px;
  line-height: 60px;
  text-align: center;
  justify-content: flex-end;
  .icon {
    width: 100%;
    vertical-align: -0.25em;
    cursor: pointer;
    text-align: center;
  }
  .icon:hover {
    fill: var(--el-menu-active-color);
    stroke: var(--el-menu-active-color);
  }
}

.custom-header {
  display: flex;
  justify-content: space-between;
  // background-color: @island-blue;
  background-color: #1976D2;
  #header-title {
    line-height: var(--el-header-height);
    color: #ffffff;
  }
  #back {
    font-size: 50px;
    cursor: pointer;
    line-height: var(--el-header-height);
    color: #ffffff;
  }
  #back:hover {
    color: #111111;
  }
}

.title{
  margin:0 auto;
}

#logo {
  text-align: center;
  height: 60px;
}
</style>
