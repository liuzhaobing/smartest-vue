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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'SmartTalk',
      component: () => import('@/views/auto-test/cases-skill/SkillReport'),
      meta: { title: 'SmartTalk', icon: 'dashboard' }
    }]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '自动化测试',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/auto-test/test-plan'),
        name: 'Menu1',
        meta: { title: '测试计划' }
      },
      {
        path: 'menu2',
        component: () => import('@/views/auto-test/test-history'),
        name: 'Menu2',
        meta: { title: '执行历史' }
      },
      {
        path: 'menu3',
        component: () => import('@/views/auto-test/test-data'),
        name: 'Menu3',
        meta: { title: '用例管理' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/auto-test/test-data/nlp-common-kg'),
            name: 'Menu1-1',
            meta: { title: '知识图谱' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/auto-test/test-data/nlp-skill'),
            name: 'Menu1-2',
            meta: { title: '系统技能' }
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/auto-test/test-data/nlp-qa'),
            name: 'Menu1-3',
            meta: { title: '通用QA' }
          },
          {
            path: 'menu1-4',
            component: () => import('@/views/auto-test/test-data/nlp-asr'),
            name: 'Menu1-4',
            meta: { title: '自研ASR' }
          },
          {
            path: 'menu1-5',
            component: () => import('@/views/auto-test/test-data/nlp-tts'),
            name: 'Menu1-5',
            meta: { title: '自研TTS' }
          }
        ]
      },
      {
        path: 'menu4',
        component: () => import('@/views/auto-test/test-env'),
        name: 'Menu4',
        meta: { title: '环境配置' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/auto-test/test-env/test-address'),
            name: 'Menu1-1',
            meta: { title: '测试环境' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/auto-test/test-env/test-type'),
            name: 'Menu1-2',
            meta: { title: '任务类型' }
          }
        ]
      },
      {
        path: 'menu5',
        component: () => import('@/views/auto-test/test-plan-dialog'),
        name: 'Menu5',
        meta: { title: '创建计划' }
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
