import React, { useState, useEffect } from 'react';
import { Image, Layer } from 'react-konva';
import { ImgRegionToolDataType } from './data';
import useImage from 'use-image';

import knightImg from '@/assets/knight.jpg';
import RomaImg from '@/assets/Eastern_roman_empire_flag.png';

interface BaseImageProps {
  // eslint-disable-next-line no-empty-pattern
  setImgRegionTool: (payload: any) => void;
  ImgToCenter: (data: any) => any;
  imgRegionTool?: ImgRegionToolDataType;
}

const BaseImage: React.FC<BaseImageProps> = props => {
  const { imgRegionTool, setImgRegionTool, ImgToCenter } = props;

  const [image] = useImage(knightImg);

  // const handleDragStart = (e: any) => {
  //   console.log('e', e);
  // };
  // const handleDragEnd = (e: any) => {
  //   console.log('e', e);

  //   setImgRegionTool({
  //     imageX: e.target.attrs.x,
  //     imageY: e.target.attrs.y,
  //   });
  // };

  useEffect(() => {
    if (!image) {
      // 判断加载图片是否成功
      return;
    }
    if (imgRegionTool) {
      const scale = Math.min(
        imgRegionTool.StageWidht / image.width,
        imgRegionTool.StageHeight / image.height,
      );
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const layerRef = React.useRef(null);

  //   React.useEffect(() => {
  //     const canvas = layerRef.current.getCanvas()._canvas;
  //     canvas.style.filter = `brightness(${(brightness + 1) * 100}%)`;
  //   }, [brightness]);

  return (
    <Layer ref={layerRef}>
      <Image
        image={image}
        x={imgRegionTool?.imageX}
        y={imgRegionTool?.imageY}
        // draggable={imgRegionTool?.toolState === 'default'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </Layer>
  );
};

export default BaseImage;
