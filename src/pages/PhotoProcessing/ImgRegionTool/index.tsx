import React from 'react';

import { Button } from 'antd';

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

  return (
    <div style={{ paddingTop: 20 }}>
      <div>
        <h1>工具</h1>
        <Button
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
        <Button
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
      </div>
      <div id="right-panel" style={{ width: 640, marginLeft: 20 }}>
        <Canvas />
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
