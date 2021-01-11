import React from 'react';

import Canvas from './Canvas';

// eslint-disable-next-line @typescript-eslint/ban-types
const ImgRegionToolDemo: React.FC<{}> = () => {
  return (
    <div style={{ paddingTop: 20 }}>
      <div id="right-panel" style={{ width: 640, marginLeft: 20 }}>
        <Canvas />
      </div>
    </div>
  );
};

export default ImgRegionToolDemo;
