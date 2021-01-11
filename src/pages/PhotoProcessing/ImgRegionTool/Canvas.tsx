/*
 * @Descripttion: 创建一个画布
 * @Author: linkenzone
 * @Date: 2021-01-11 10:08:24
 */
import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from './model';
import { ImgRegionToolDataType } from './data';
import { Stage } from 'react-konva';
import Konva from 'konva';

import BaseImage from './BaseImage';

interface CanvasProps {
  dispatch: Dispatch;
  imgRegionTool?: ImgRegionToolDataType;
}

const Canvas: React.FC<CanvasProps> = props => {
  const { imgRegionTool, dispatch } = props;

  // 获取node
  const stageRef: any = React.useRef();

  /**
   * @description: 限制变量的范围
   * @Param:
   * @param {any} stage
   * @param {any} newAttrs
   */
  const limitAttributes = (stage: any, newAttrs: any) => {
    const box = stage.findOne('Image').getClientRect();
    const minX = -box.width + stage.width() / 2;
    const maxX = stage.width() / 2;

    const x = Math.max(minX, Math.min(newAttrs.x, maxX));

    const minY = -box.height + stage.height() / 2;
    const maxY = stage.height() / 2;

    const y = Math.max(minY, Math.min(newAttrs.y, maxY));

    const scale = Math.max(0.05, newAttrs.scale);

    return { x, y, scale };
  };

  /**
   * @description: 将图片移动到中心
   * @Param:
   * @param {any} param1
   */

  const ImgToCenter = ({ imageWidth, imageHeight, StageWidht, StageHeight }: any) => {
    return { x: (StageWidht - imageWidth) / 2, y: (StageHeight - imageHeight) / 2 };
  };

  /**
   * @description: 重置图片的位置
   * @Param:
   */

  const resetImg = () => {
    if (imgRegionTool) {
      const scale = Math.min(
        imgRegionTool.StageWidht / imgRegionTool.imageWidth,
        imgRegionTool.StageHeight / imgRegionTool.imageHeight,
      );

      const { x, y } = ImgToCenter({
        imageWidth: imgRegionTool.imageWidth,
        imageHeight: imgRegionTool.imageHeight,
        StageWidht: imgRegionTool.StageWidht / scale,
        StageHeight: imgRegionTool.StageHeight / scale,
      });

      dispatch({
        type: 'imgRegionTool/setImgRegionTool',
        payload: {
          StageScale: scale,
          imageX: x,
          imageY: y,
        },
      });

      stageRef.current.x(0);
      stageRef.current.y(0);

      stageRef.current.batchDraw();
    }
  };

  /**
   * @description: 放大Stage
   * @Param:
   * @param {any} stage
   * @param {any} scaleBy
   */

  const zoomStage = (stage: any, scaleBy: any) => {
    const oldScale = stage.scaleX();

    // 获取中点
    const midPos = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };
    const mousePointTo = {
      x: midPos.x / oldScale - stage.x() / oldScale,
      y: midPos.y / oldScale - stage.y() / oldScale,
    };
    const newScale = Math.max(0.05, oldScale * scaleBy);

    const newPos = {
      x: -(mousePointTo.x - midPos.x / newScale) * newScale,
      y: -(mousePointTo.y - midPos.y / newScale) * newScale,
    };

    // 限制变量的范围
    const newAttrs = limitAttributes(stage, { ...newPos, scale: newScale });

    stage.to({
      x: newAttrs.x,
      y: newAttrs.y,
      scaleX: newAttrs.scale,
      scaleY: newAttrs.scale,
      duration: 0.1,
    });

    dispatch({
      type: 'imgRegionTool/setImgRegionTool',
      payload: {
        StageScale: newAttrs.scale,
      },
    });

    // 更新 stage
    stage.batchDraw();
  };

  useEffect(() => {
    // const container = document.querySelector('.right-panel');
    dispatch({
      type: 'imgRegionTool/setImgRegionTool',
      payload: {
        StageWidht: 640,
        StageHeight: 480,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    // const container = document.querySelector('.right-panel');
    console.log('imgRegionTool', imgRegionTool);
  }, [imgRegionTool]);

  return (
    <>
      <Stage
        ref={stageRef}
        width={imgRegionTool?.StageWidht}
        height={imgRegionTool?.StageHeight}
        scaleX={imgRegionTool?.StageScale}
        scaleY={imgRegionTool?.StageScale}
        style={{ boxShadow: '0 0 5px grey' }}
      >
        <BaseImage
          imgRegionTool={imgRegionTool}
          ImgToCenter={ImgToCenter}
          setImgRegionTool={payload => {
            dispatch({
              type: 'imgRegionTool/setImgRegionTool',
              payload: {
                ...payload,
              },
            });
          }}
        />
      </Stage>
      <div className="zoom-container">
        <button
          onClick={() => {
            zoomStage(stageRef.current, 1.2);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            zoomStage(stageRef.current, 0.8);
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            resetImg();
          }}
        >
          reset
        </button>

        <button
          onClick={() => {
            if (imgRegionTool) {
              dispatch({
                type: 'imgRegionTool/setImgRegionTool',
                payload: {
                  imageX: imgRegionTool.imageX + 10,
                },
              });
            }
          }}
        >
          右移
        </button>
      </div>
    </>
  );
};

const mapStateToProps = ({ imgRegionTool }: { imgRegionTool: StateType }) => {
  return {
    imgRegionTool: imgRegionTool.imgRegionTool,
  };
};

export default connect(mapStateToProps)(Canvas);
