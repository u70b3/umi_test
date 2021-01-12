import React from 'react';

import { Button, List, Input, InputNumber, Space } from 'antd';

import { connect, Dispatch } from 'umi';
import { StateType } from './model';
import { ImgRegionToolDataType } from './data';

import Canvas from './Canvas';

interface ImgRegionToolProps {
  dispatch: Dispatch;
  imgRegionTool?: ImgRegionToolDataType;
}

const ImgRegionToolDemo: React.FC<ImgRegionToolProps> = props => {
  const { imgRegionTool, dispatch } = props;

  const childRef: any = React.useRef();

  return (
    <div style={{ paddingTop: 20, paddingLeft: 20, width: 640 }}>
      <div
        id="header-nav"
        style={{ padding: 12, width: 640, border: '1px solid #d9d9d9', marginBottom: 10 }}
      >
        <Space>
          <Button
            type="primary"
            onClick={() => {
              // console.log('childRef.current', childRef.current);
              childRef.current.resetImg();
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            onClick={() => {
              dispatch({
                type: 'imgRegionTool/setImgRegionTool',
                payload: {
                  toolState: 'default',
                },
              });
            }}
          >
            移动
          </Button>
          <Button
            type="primary"
            onClick={() => {
              dispatch({
                type: 'imgRegionTool/setImgRegionTool',
                payload: {
                  toolState: 'region',
                },
              });
            }}
          >
            选区
          </Button>
          选区粗细
          <InputNumber
            value={imgRegionTool?.regionsStrokeWidth}
            onChange={e => {
              console.log('e', e);
              if (imgRegionTool) {
                dispatch({
                  type: 'imgRegionTool/setImgRegionTool',
                  payload: { regionsStrokeWidth: e },
                });
              }
            }}
          />
          选区字体大小
          <InputNumber
            value={imgRegionTool?.regionsFontSize}
            onChange={e => {
              console.log('e', e);
              if (imgRegionTool) {
                dispatch({
                  type: 'imgRegionTool/setImgRegionTool',
                  payload: { regionsFontSize: e },
                });
              }
            }}
          />
        </Space>
      </div>
      <div id="main_window" style={{ display: 'block' }}>
        <div id="right-panel" style={{ width: 640, marginLeft: 0 }}>
          <Canvas ref={childRef} />
        </div>

        <div id="Left-panel" style={{ width: 640, marginTop: 8 }}>
          <List
            header={<div>选区</div>}
            bordered
            dataSource={imgRegionTool?.regions}
            renderItem={(region: any, index: number) => (
              <List.Item>
                <span style={{ width: 40 }}>{region.id}</span>
                <Input
                  value={region.name}
                  onChange={e => {
                    console.log('e', e);
                    if (imgRegionTool) {
                      region.name = e.target.value;
                      imgRegionTool.regions[index] = region;
                      dispatch({
                        type: 'imgRegionTool/setImgRegionTool',
                        payload: { regions: imgRegionTool.regions },
                      });
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (imgRegionTool) {
                      imgRegionTool.regions.splice(index, 1);
                      dispatch({
                        type: 'imgRegionTool/setImgRegionTool',
                        payload: { regions: imgRegionTool.regions },
                      });
                    }
                  }}
                  style={{ marginLeft: 10 }}
                  type="primary"
                  danger
                >
                  删除
                </Button>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ imgRegionTool }: { imgRegionTool: StateType }) => {
  return {
    imgRegionTool: imgRegionTool.imgRegionTool,
  };
};

export default connect(mapStateToProps)(ImgRegionToolDemo);
