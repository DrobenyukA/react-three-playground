import { Canvas } from '@react-three/fiber';
import { DragControls, Grid, OrbitControls } from '@react-three/drei';

import { Cube } from './Cube';
import { Light } from './Light';
import { useLayoutEffect, useState } from 'react';

export const Basics = () => {
  const [isCameraEnabled, setCameraEnabled] = useState(true);

  useLayoutEffect(() => {
    const handleEnableCamera = () => setCameraEnabled(true);
    const handleDisableCamera = () => setCameraEnabled(false);
    document.addEventListener('enable-camera', handleEnableCamera);
    document.addEventListener('disable-camera', handleDisableCamera);

    return () => {
      document.removeEventListener('enable-camera', handleEnableCamera);
      document.removeEventListener('disable-camera', handleDisableCamera);
    };
  }, []);

  return (
    <Canvas className="react-three-fiber">
      <Light />

      <Grid position={[0, 0, 0]} infiniteGrid={true} cellColor="white" />

      <DragControls
        axisLock="x"
        onDrag={() => setCameraEnabled(false)}
        onDragEnd={() => setCameraEnabled(true)}
      >
        <mesh position={[3, 3, 0]}>
          <sphereGeometry args={[1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </DragControls>

      <group position={[0, 0, 0]}>
        <Cube position={[1, 1.5, 0.5]} size={1} color="red" />
        {/* <Cube position={[2, 1.5, 0.5]} size={1} color="green" />
        <Cube position={[1, 0.5, 0.5]} size={1} color="blue" />
        <Cube position={[2, 0.5, 0.5]} size={1} color="yellow" /> */}
      </group>

      <OrbitControls enabled={isCameraEnabled} />
    </Canvas>
  );
};
