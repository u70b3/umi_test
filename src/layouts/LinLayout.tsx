/*
 * @Descripttion: 通用头部菜单
 * @Author: linkenzone
 * @Date: 2020-09-06 21:24:32
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import { history, Dispatch } from 'umi';
import React, { useEffect, useState } from 'react';
import style from './index.less';
import { SmileOutlined } from '@ant-design/icons';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings; // layout 的设置
  dispatch: Dispatch;
}

const defaultProps = {
  routes: [
    {
      path: '/welcome',
      name: '欢迎',
      icon: <SmileOutlined />,
    },
    {
      path: '/PhotoProcessing',
      name: '图像处理',
      icon: <SmileOutlined />,
      access: 'canAdmin',
      routes: [
        {
          path: '/PhotoProcessing/BaseDemo',
          name: '基础demo:拖拽功能',
          icon: <SmileOutlined />,
        },
        {
          path: '/PhotoProcessing/ImgRegionTool',
          name: '图片选区工具',
          icon: <SmileOutlined />,
        },
        // {
        //   path: '/PhotoProcessing/sub-page3',
        //   name: '333',
        //   icon: <SmileOutlined />,
        // },
      ],
    },
    {
      path: '/ThreeJs',
      name: 'ThreeJs',
      icon: <SmileOutlined />,
      routes: [
        {
          path: '/ThreeJs/BaseDemo',
          name: '基础demo',
          icon: <SmileOutlined />,
        },
        {
          path: '/ThreeJs/ModelDemo',
          name: '模型demo',
          icon: <SmileOutlined />,
        },
        {
          path: '/ThreeJs/VolumeDemo',
          name: '小鼠demo',
          icon: <SmileOutlined />,
        },
      ],
    },
    {
      path: '/admin/sub-page3',
      name: '三级页面',
      icon: <SmileOutlined />,
    },
  ],
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { children } = props;

  const [pathname, setPathname] = useState('/welcome');

  return (
    <ProLayout
      title="linLayout"
      route={defaultProps}
      fixSiderbar
      // navTheme="light"
      location={{ pathname }}
      menuItemRender={(item, dom) => (
        <a
          onClick={() => {
            setPathname(item.path || '/welcome');
            history.push(item.path || '/welcome');
          }}
        >
          {dom}
        </a>
      )}
      contentStyle={{ margin: '0', backgroundColor: 'white', minHeight: 1000 }}
      // className={style.custom_layout}
    >
      {children}
    </ProLayout>
  );
};

export default BasicLayout;
