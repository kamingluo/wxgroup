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
          path: '/tasks',
          component: resolve => require(['../components/page/Tasks.vue'], resolve),
          meta: { title: '任务审核' }
        },
        {
          path: '/limittasks',
          component: resolve => require(['../components/page/Limittasks.vue'], resolve),
          meta: { title: '限时任务' }
        },
        {
          path: '/auditlimittask',
          component: resolve => require(['../components/page/Auditlimittask.vue'], resolve),
          meta: { title: '处理限时任务',noActive:true  }
        },
        {
          path: '/scorelist',
          component: resolve => require(['../components/page/Scorelist.vue'], resolve),
          meta: { title: '积分流水' }
        },
        {
          path: '/signin',
          component: resolve => require(['../components/page/Signin.vue'], resolve),
          meta: { title: '签到查询' }
        },
        {
          path: '/coupon',
          component: resolve => require(['../components/page/Coupon.vue'], resolve),
          meta: { title: '优惠券' }
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
  ]
})
