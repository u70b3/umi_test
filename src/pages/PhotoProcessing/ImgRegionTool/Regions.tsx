import React, { useEffect } from 'react';
import { Layer, Line, Text, Rect, Circle, Group, Label, Tag } from 'react-konva';
import ImgRegionTool from '.';
import { ImgRegionToolDataType } from './data';

interface RegionsProps {
  regions?: any[];
  setImgRegionTool?: (payload: any) => void;
  imagePos?: { x: number | undefined; y: number | undefined };
  regionAttribute: { strokeWidth: number; fontSize: number };
}

const Regions: React.FC<RegionsProps> = props => {
  const layerRef: any = React.useRef(null);

  // const [length, setLength] = React.useState(1);
  // const itemsRef: any = React.useRef([]);

  const { regions, imagePos, regionAttribute } = props;

  // React.useEffect(() => {
  //   itemsRef.current = itemsRef.current.slice(0, regions?.length);
  // }, [regions?.length]);

  return (
    <Layer ref={layerRef}>
      <Group x={imagePos?.x} y={imagePos?.y}>
        {regions?.map(region => {
          return (
            <React.Fragment key={region.id}>
              <Line
                name="region"
                points={region.points.flatMap((p: any) => [p.x, p.y])}
                stroke="#ff0000b3"
                dash={[regionAttribute.strokeWidth * 2, regionAttribute.strokeWidth]}
                strokeWidth={regionAttribute.strokeWidth}
                closed // 线条是否封闭?
                onClick={() => {
                  console.log('选中:', region.id);
                }}
              />
              {/* {region.points.map((point: any) => {
                return <Circle x={point.x} y={point.y} radius={4} fill="black" />;
              })} */}
              {/* <Rect
                fill="#ddd"
                width={regionAttribute.fontSize * 7}
                height={itemsRef.current[index] ? itemsRef.current[index].height() : null}
                x={region.points[region.points.length - 1].x}
                y={region.points[region.points.length - 1].y}
              /> */}
              <Label
                x={region.points[region.points.length - 1].x}
                y={region.points[region.points.length - 1].y}
              >
                <Tag fill="#ddd" opacity={0.5} />
                <Text
                  // ref={el => (itemsRef.current[index] = el)}
                  text={region.name}
                  fontSize={regionAttribute.fontSize}
                  fill="blach"
                  fontStyle="bold"
                  width={regionAttribute.fontSize * 6.7}
                  align="center"
                  fontFamily="Calibri"
                  padding={10}
                />
              </Label>
            </React.Fragment>
          );
        })}
      </Group>
    </Layer>
  );
};

export default Regions;
