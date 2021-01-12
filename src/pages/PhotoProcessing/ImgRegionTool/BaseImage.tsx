import React, { useState, useEffect } from 'react';
import { Image, Layer } from 'react-konva';
import { ImgRegionToolDataType } from './data';
import useImage from 'use-image';

import knightImg from '@/assets/knight.jpg';
import RomaImg from '@/assets/Eastern_roman_empire_flag.png';
import thrImg from '@/assets/13.jpg';

interface BaseImageProps {
  setImgRegionTool: (payload: any) => void;
  ImgToCenter: (data: any) => any;
  imgRegionTool?: ImgRegionToolDataType;
  stageRef: any;
}

const BaseImage: React.FC<BaseImageProps> = props => {
  const { imgRegionTool, setImgRegionTool, ImgToCenter, stageRef } = props;

  const [image] = useImage(knightImg);

  useEffect(() => {
    // 判断加载图片是否成功
    if (!image) {
      return;
    }
    if (imgRegionTool) {
      let scale = 1;
      if (image.width > 640 || image.height > 480) {
        scale = Math.min(
          imgRegionTool.StageWidht / image.width,
          imgRegionTool.StageHeight / image.height,
        );
      }

      // 图片的宽高比
      // const ratio = image.width / image.height;

      const { x, y } = ImgToCenter({
        imageWidth: image.width,
        imageHeight: image.height,
        StageWidht: imgRegionTool.StageWidht / scale,
        StageHeight: imgRegionTool.StageHeight / scale,
      });

      setImgRegionTool({
        StageScale: scale,
        imageWidth: image.width,
        imageHeight: image.height,
        imageX: x,
        imageY: y,
      });

      stageRef.current.scaleX(scale);
      stageRef.current.scaleY(scale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const layerRef = React.useRef(null);

  return (
    <Layer ref={layerRef}>
      <Image image={image} x={imgRegionTool?.imageX} y={imgRegionTool?.imageY} />
    </Layer>
  );
};

export default BaseImage;
