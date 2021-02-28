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
            path: '/PhotoProcessing/BaseDemo',
            component: '@/pages/PhotoProcessing/BaseDemo',
          },
          {
            path: '/PhotoProcessing/ImgRegionTool',
            component: '@/pages/PhotoProcessing/ImgRegionTool',
          },

          {
            path: '/ThreeJs/BaseDemo',
            component: '@/pages/ThreeJs/BaseDemo',
          },

          {
            path: '/ThreeJs/ModelDemo',
            component: '@/pages/ThreeJs/ModelDemo',
          },

          {
            path: '/ThreeJs/VolumeDemo',
            component: '@/pages/ThreeJs/VolumeDemo',
          },

          {
            component: '404',
          },
        ],
      },
    ],
  },
];
