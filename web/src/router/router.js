import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: { title: '系统首页' }
        },
        {
          path: '/users',
          component: resolve => require(['../components/page/Users.vue'], resolve),
          meta: { title: '用户列表' }
        },
        {
          path: '/groups',
          component: resolve => require(['../components/page/Groups.vue'], resolve),
          meta: { title: '群列表' }
        },
        {
          path: '/tasks',
          component: resolve => require(['../components/page/Tasks.vue'], resolve),
          meta: { title: '任务记录' }
        },
        {
          path: '/lotterylist',
          component: resolve => require(['../components/page/Lotterylist.vue'], resolve),
          meta: { title: '发布的抽奖' }
        },
        {
          path: '/news',
          component: resolve => require(['../components/page/News.vue'], resolve),
          meta: { title: '群消息' }
        },
        {
          path: '/chat',
          component: resolve => require(['../components/page/Chat.vue'], resolve),
          meta: { title: '聊天记录' }
        },
        {
          path: '/exchanges',
          component: resolve => require(['../components/page/Exchanges.vue'], resolve),
          meta: { title: '兑换信息' }
        },
        {
          path: '/groupjurisdiction',
          component: resolve => require(['../components/page/Groupjurisdiction.vue'], resolve),
          meta: { title: '群权限' }
        },
        {
          path: '/examine',
          component: resolve => require(['../components/page/Examine.vue'], resolve),
          meta: { title: '金币兑换列表' }
        },
        {
          path: '/clickaddata',
          component: resolve => require(['../components/page/Clickaddata.vue'], resolve),
          meta: { title: '点击广告列表' }
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '@/pages/About.vue')
    // }
  ]
})
