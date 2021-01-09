import React from 'react';
// import { connect } from 'umi';
import { Breadcrumb, Card, Row, Col } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Stage, Layer, Rect, Text, Circle, Line, Star } from 'react-konva';
import Konva from 'konva';

/**
 * @description: 生成图形
 * @Param:
 */
const generateShapes = () => {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
};

const INITIAL_STATE = generateShapes();

// eslint-disable-next-line @typescript-eslint/ban-types
const PhotoEditor: React.FC<{}> = () => {
  const [stars, setStars] = React.useState(INITIAL_STATE);
  const handleDragStart = (e: any) => {
    const id = e.target.id();
    setStars(
      stars.map(star => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      }),
    );
  };
  const handleDragEnd = () => {
    setStars(
      stars.map(star => {
        return {
          ...star,
          isDragging: false,
        };
      }),
    );
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try to drag a star" />
        {stars.map(star => (
          <Star
            key={star.id}
            id={star.id}
            // 坐标
            x={star.x}
            y={star.y}
            // 角的数量
            numPoints={6}
            // 内半径
            innerRadius={50}
            // 外半径
            outerRadius={100}
            // 填充的颜色
            fill="#89b717"
            // 透明度
            opacity={0.8}
            // 旋转
            rotation={star.rotation}
            // 阴影
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={star.isDragging ? 10 : 5}
            shadowOffsetY={star.isDragging ? 10 : 5}
            // 缩放
            scaleX={star.isDragging ? 1.2 : 1}
            scaleY={star.isDragging ? 1.2 : 1}
            // 拖动
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default PhotoEditor;
