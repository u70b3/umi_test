/*
 * @Descripttion: 路由配置
 * @Author: linkenzone
 * @Date: 2020-09-04 00:20:59
 * 路由配置 : https://umijs.org/zh-CN/docs/routing
 */

export default [
  {
    path: '/',
    component: '@/layouts/BlankLayout',
    routes: [
      {
        path: '/',
        component: '@/layouts/LinLayout',
        routes: [
          {
            path: '/',
            component: '@/pages/index.tsx',
          },
          {
            path: '/PhotoProcessing/PhotoEditor',
            component: '@/pages/PhotoProcessing/PhotoEditor',
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
];
