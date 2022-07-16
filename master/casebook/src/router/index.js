import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/after-end',
    component: () => import(/* webpackChunkName:"admin" */ '@/views/Home.vue'),
    children: [
      {
        path: 'after-end',
        name: 'after',
        component: () =>
          import(/* webpackChunkName: "admin-children" */ '@/views/After.vue'),
        meta: {
          title: '后端数据处理',
          index: '1'
        }
      },
      {
        path: 'front-end',
        name: 'front',
        component: () =>
          import(/* webpackChunkName: "admin-children" */ '@/views/Front.vue'),
        meta: {
          title: '前端数据处理',
          index: '2'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
