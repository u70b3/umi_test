import React from 'react';
import ReactDOM from 'react-dom';

import { View, VolumeRepresentation, VolumeController, Reader } from 'react-vtk-js';

const BaseDemo: React.FC<null> = () => {
  const array = [];
  while (array.length < 1000) {
    array.push(Math.random());
  }
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <View id="0">
        <VolumeRepresentation>
          <VolumeController />
          <Reader
            vtkClass="vtkXMLImageDataReader"
            // url="https://data.kitware.com/api/v1/item/59e12e988d777f31ac6455c5/download"
            url="/test.vti"
          />
        </VolumeRepresentation>
      </View>
    </div>
  );
  // return (
  //   <>
  //     <View>
  //       <GeometryRepresentation>
  //         <Reader vtkClass="vtkOBJReader" url={'https://groups.csail.mit.edu/graphics/classes/6.837/F03/models/teapot.obj'} />
  //       </GeometryRepresentation>
  //     </View>
  //   </>
  // );
};

export default BaseDemo;
