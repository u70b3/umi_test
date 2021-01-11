import React from 'react';
import { Layer, Line, Text, Rect, Circle } from 'react-konva';
import { ImgRegionToolDataType } from './data';

interface RegionsProps {
  regions?: any[];
  setImgRegionTool?: (payload: any) => void;
  imgRegionTool?: ImgRegionToolDataType;
}

const Regions: React.FC<RegionsProps> = props => {
  const layerRef = React.useRef(null);

  const { regions } = props;

  return (
    <Layer ref={layerRef}>
      {regions?.map(region => {
        return (
          <React.Fragment key={region.id}>
            <Line
              name="region"
              points={region.points.flatMap((p: any) => [p.x, p.y])}
              // fill={'white'}
              stroke="red"
              dash={[20, 10]}
              strokeWidth={5}
              closed // 线条是否封闭?
              onClick={() => {
                console.log('选中:', region.id);
              }}
            />
            {/* {region.points.map((point: any) => {
              return <Circle x={point.x} y={point.y} radius={4} fill='black'/>;
            })} */}
            <Rect
              fill="#ddd"
              width={100}
              height={40}
              opacity={0.5}
              x={region.points[region.points.length - 1].x}
              y={region.points[region.points.length - 1].y}
            />
            <Text
              text={region.id}
              fontSize={30}
              fill="blach"
              fontStyle="bold"
              width={100}
              align="center"
              //   padding={20}
              x={region.points[region.points.length - 1].x}
              y={region.points[region.points.length - 1].y}
            />
          </React.Fragment>
        );
      })}
    </Layer>
  );
};

export default Regions;
