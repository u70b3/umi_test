import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Star, Image, Transformer } from 'react-konva';
import Konva from 'konva';
import RomaImg from '@/assets/Eastern_roman_empire_flag.png';
import knightImg from '@/assets/knight.jpg';
import useImage from 'use-image';

const pulseShape = (shape: any) => {
  // use Konva methods to animate a shape
  shape.to({
    scaleX: 1.5,
    scaleY: 1.5,
    onFinish: () => {
      shape.to({
        scaleX: 1,
        scaleY: 1,
      });
    },
  });
};

const RomaImage = ({ isSelected, onSelect }: any) => {
  const [image] = useImage(RomaImg);
  const trRef: any = React.useRef();
  const ImageRef: any = React.useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([ImageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        ref={ImageRef}
        onClick={onSelect}
        onTap={onSelect}
        image={image}
        x={50}
        y={50}
        draggable
        onTransformEnd={() => {
          const node = ImageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          // 改变width 和 height
          node.width(Math.max(5, node.width() * scaleX));
          node.height(Math.max(node.height() * scaleY));
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const RomaImage_filters = () => {
  const [image] = useImage(RomaImg);

  // 可以使用refs API访问 Konva node
  const imageRef: any = React.useRef();

  const [blurRadius, setBlurRadius] = useState(5);
  // 当图片加载的时候需要去缓存它的形状
  useEffect(() => {
    if (image) {
      // 你需要在一些props改变上重新应用缓存，比如阴影，描边等。
      imageRef.current.cache();
      // 因为这个更新不是由“react-konva”处理的，我们直接使用Konva方法
      // 我们必须手动重绘图层
      imageRef.current.getLayer().batchDraw();
    }
  }, [image]);

  const handleScroll = (e: any) => {
    e.evt.preventDefault();

    console.log(e.evt.deltaY);
    if (e.evt.deltaY > 0) {
      if (blurRadius > 0) {
        setBlurRadius(blurRadius - 1);
      }
    } else {
      setBlurRadius(blurRadius + 1);
    }
    // setBlurRadius(blurRadius + 1);
  };

  const handleClick = (e: any) => {
    // const shape = imageRef.current;
    // pulseShape(shape);

    // another way to access Konva nodes is to just use event object
    const shape = e.target;
    pulseShape(shape);
    // prevent click on stage
    e.cancelBubble = true;
  };

  return (
    <Image
      image={image}
      x={400}
      y={50}
      draggable
      ref={imageRef}
      filters={[Konva.Filters.Blur]}
      blurRadius={blurRadius}
      onWheel={handleScroll}
      onClick={handleClick}
      onMouseEnter={(e: any) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'pointer';
      }}
      onMouseLeave={(e: any) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'default';
      }}
    />
  );
};

const KnightImage = () => {
  const [image] = useImage(knightImg);
  return <Image image={image} x={50} y={350} scaleX={0.5} scaleY={0.5} draggable />;
};

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
  const [isSelected, setIsSelected] = useState(false);

  const onSelect = () => {
    setIsSelected(true);
  };

  const handleDragStart = (e: any) => {
    console.log('e', e);
    // 改变星星的z-index
    e.target.moveToTop();
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
  const handleDragEnd = (e: any) => {
    console.log('e', e);
    setStars(
      stars.map(star => {
        return {
          ...star,
          isDragging: false,
        };
      }),
    );
  };

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsSelected(false);
    }
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={checkDeselect}>
      <Layer>
        <Text text="Try to drag a star" />
        <RomaImage isSelected={isSelected} onSelect={onSelect} />
        <RomaImage_filters />
        <KnightImage />
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
