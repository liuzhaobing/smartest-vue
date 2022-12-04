import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/overview',
    children: [{
      path: 'overview',
      name: 'SmartTalk',
      component: () => import('@/views/auto-test/cases-skill/SkillReport'),
      meta: { title: 'SmartTalk', icon: 'dashboard' }
    }]
  },

  {
    path: '/smartest',
    component: Layout,
    redirect: '/smartest/test-plan',
    name: 'smartest',
    meta: {
      title: '自动化测试',
      icon: 'nested'
    },
    children: [
      {
        path: 'test-plan',
        component: () => import('@/views/auto-test/test-plan'),
        name: 'test-plan',
        meta: { title: '测试计划' }
      },
      {
        path: 'test-history',
        component: () => import('@/views/auto-test/test-history'),
        name: 'test-history',
        meta: { title: '执行历史' }
      },
      {
        path: 'test-data',
        component: () => import('@/views/auto-test/test-data'),
        name: 'test-data',
        meta: { title: '用例管理' }
      },
      {
        path: 'test-env',
        component: () => import('@/views/auto-test/test-env/test-address'),
        name: 'test-env',
        meta: { title: '环境配置' }
      },
      {
        path: 'data-analysis',
        component: () => import('@/views/auto-test/test-table'),
        name: 'data-analysis',
        meta: { title: '调试页面' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
