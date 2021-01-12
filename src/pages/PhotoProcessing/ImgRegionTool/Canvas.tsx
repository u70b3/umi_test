/*
 * @Descripttion: 创建一个画布
 * @Author: linkenzone
 * @Date: 2021-01-11 10:08:24
 */
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from './model';
import { ImgRegionToolDataType } from './data';
import { Stage } from 'react-konva';
import Konva from 'konva';

import BaseImage from './BaseImage';

import Regions from './Regions';

interface CanvasProps {
  dispatch: Dispatch;
  imgRegionTool?: ImgRegionToolDataType;
}

const Canvas: React.FC<CanvasProps> = (props, ref) => {
  const { imgRegionTool, dispatch } = props;

  // 获取node
  const stageRef: any = React.useRef();

  const getRelativePointerPosition = (node: any) => {
    // 该函数将返回相对于所传递节点的指针位置;
    const transform = node.getAbsoluteTransform().copy();

    // 为了检测相对位置，我们需要进行逆变换
    transform.invert();

    // 获取指针(鼠标或触摸)位置
    const pos = node.getStage().getPointerPosition();

    // 现在我们求相对点
    return transform.point(pos);
  };

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

  const ToImgRelativePosition = ({ x, y }: any) => {
    if (imgRegionTool) {
      return { x: x - imgRegionTool.imageX, y: y - imgRegionTool.imageY };
    }
    return { x: 0, y: 0 };
  };

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    resetImg: () => {
      if (imgRegionTool) {
        let scale = 1;
        if (imgRegionTool.imageWidth > 640 || imgRegionTool.imageHeight > 480) {
          scale = Math.min(
            imgRegionTool.StageWidht / imgRegionTool.imageWidth,
            imgRegionTool.StageHeight / imgRegionTool.imageHeight,
          );
        }

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
        stageRef.current.scaleX(scale);
        stageRef.current.scaleY(scale);

        stageRef.current.batchDraw();
      }
    },
  }));

  const resetImg = () => {
    if (imgRegionTool) {
      let scale = 1;
      if (imgRegionTool.imageWidth > 640 || imgRegionTool.imageHeight > 480) {
        scale = Math.min(
          imgRegionTool.StageWidht / imgRegionTool.imageWidth,
          imgRegionTool.StageHeight / imgRegionTool.imageHeight,
        );
      }

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
      stageRef.current.scaleX(scale);
      stageRef.current.scaleY(scale);

      stageRef.current.batchDraw();
    }
  };

  /**
   * @description: 放大Stage
   * @Param:
   * @param {any} stage
   * @param {any} scaleBy
   */

  const zoomStage = (stage: any, scaleBy: any, duration: number) => {
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
      duration,
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
    // dispatch({
    //   type: 'imgRegionTool/setImgRegionTool',
    //   payload: {
    //     StageWidht: 640,
    //     StageHeight: 480,
    //   },
    // });
    resetImg();
  }, []);

  // useEffect(() => {
  //   // const container = document.querySelector('.right-panel');
  //   console.log('imgRegionTool', imgRegionTool);
  //   stageRef.current.scaleX(imgRegionTool?.StageScale);
  //   stageRef.current.scaleY(imgRegionTool?.StageScale);
  // }, [imgRegionTool]);

  return (
    <>
      <Stage
        ref={stageRef}
        draggable={imgRegionTool?.toolState === 'default'}
        width={imgRegionTool?.StageWidht}
        height={imgRegionTool?.StageHeight}
        style={{ boxShadow: '0 0 5px grey' }}
        onMouseDown={e => {
          if (imgRegionTool?.toolState !== 'region') {
            return;
          }
          dispatch({
            type: 'imgRegionTool/setImgRegionTool',
            payload: { isDrawing: true },
          });
          // 获取相对坐标
          let point = getRelativePointerPosition(e.target.getStage());
          // 获取相对于图片的坐标
          point = ToImgRelativePosition(point);
          const region = {
            // eslint-disable-next-line no-plusplus
            id: imgRegionTool.maxId + 1,
            name: `New Region${imgRegionTool.maxId + 1}`,
            points: [point],
          };

          dispatch({
            type: 'imgRegionTool/setImgRegionTool',
            payload: { regions: imgRegionTool?.regions.concat([region]) },
          });
        }}
        onMouseMove={e => {
          if (!imgRegionTool?.isDrawing || imgRegionTool.toolState !== 'region') {
            return;
          }
          // if (!imgRegionTool?.isDrawing) {
          //   return;
          // }
          if (imgRegionTool) {
            const lastRegion = { ...imgRegionTool.regions[imgRegionTool.regions.length - 1] };
            // 获取相对坐标
            let point = getRelativePointerPosition(e.target.getStage());
            // 获取相对于图片的坐标
            point = ToImgRelativePosition(point);
            lastRegion.points = lastRegion.points.concat([point]);
            // 删除最后一个区域
            imgRegionTool.regions.splice(imgRegionTool.regions.length - 1, 1);
            dispatch({
              type: 'imgRegionTool/setImgRegionTool',
              payload: { regions: imgRegionTool.regions.concat([lastRegion]) },
            });
          }
        }}
        onMouseUp={e => {
          if (!imgRegionTool?.isDrawing || imgRegionTool.toolState !== 'region') {
            return;
          }
          // if (!imgRegionTool?.isDrawing) {
          //   return;
          // }
          if (imgRegionTool) {
            const lastRegion = imgRegionTool.regions[imgRegionTool.regions.length - 1];
            // 如果不足3个点，则删除
            if (lastRegion.points.length < 3) {
              imgRegionTool.regions.splice(imgRegionTool.regions.length - 1, 1);
              dispatch({
                type: 'imgRegionTool/setImgRegionTool',
                payload: { regions: imgRegionTool.regions, isDrawing: false },
              });
            } else {
              // 每10个点进行采样
              let points = [lastRegion.points[0]];
              for (let i = 10; i < lastRegion.points.length; i += 10) {
                points = points.concat(lastRegion.points[i]);
              }
              const newlastRegion = { ...imgRegionTool.regions[imgRegionTool.regions.length - 1] };
              newlastRegion.points = points;
              // 删除最后一个区域
              imgRegionTool.regions.splice(imgRegionTool.regions.length - 1, 1);
              dispatch({
                type: 'imgRegionTool/setImgRegionTool',
                payload: {
                  regions: imgRegionTool.regions.concat([newlastRegion]),
                  maxId: imgRegionTool.maxId + 1,
                  isDrawing: false,
                },
              });
            }
          }
        }}
        onWheel={(e: any) => {
          e.evt.preventDefault();
          if (e.evt.deltaY > 0) {
            zoomStage(stageRef.current, 0.8, 0.1);
          } else {
            zoomStage(stageRef.current, 1.2, 0.1);
          }
        }}
        onMouseEnter={(e: any) => {
          const container = e.target.getStage().container();
          if (imgRegionTool?.toolState === 'default') {
            container.style.cursor = 'move';
          } else {
            container.style.cursor = 'crosshair';
          }
        }}
        onMouseLeave={(e: any) => {
          const container = e.target.getStage().container();
          container.style.cursor = 'default';
        }}
      >
        <BaseImage
          imgRegionTool={imgRegionTool}
          ImgToCenter={ImgToCenter}
          stageRef={stageRef}
          setImgRegionTool={payload => {
            dispatch({
              type: 'imgRegionTool/setImgRegionTool',
              payload: {
                ...payload,
              },
            });
          }}
        />

        <Regions
          regions={imgRegionTool?.regions}
          imagePos={{ x: imgRegionTool?.imageX, y: imgRegionTool?.imageY }}
          regionAttribute={{
            strokeWidth: imgRegionTool ? imgRegionTool.regionsStrokeWidth : 4,
            fontSize: imgRegionTool ? imgRegionTool.regionsFontSize : 42,
          }}
        />
      </Stage>
      {/* <div className="zoom-container">
        <button
          onClick={() => {
            zoomStage(stageRef.current, 1.2, 0.1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            zoomStage(stageRef.current, 0.8, 0.1);
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
      </div> */}
    </>
  );
};

const mapStateToProps = ({ imgRegionTool }: { imgRegionTool: StateType }) => {
  return {
    imgRegionTool: imgRegionTool.imgRegionTool,
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef(Canvas));
