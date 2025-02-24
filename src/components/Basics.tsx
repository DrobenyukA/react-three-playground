import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

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
      <mesh position={[3, 3, 0]}>
        <sphereGeometry args={[1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <group position={[0, 0, 0]}>
        <Cube position={[-0.65, 0.65, -0.65]} size={1} color="red" />
        <Cube position={[0.65, 0.65, -0.65]} size={1} color="green" />
        <Cube position={[-0.65, -0.65, -0.65]} size={1} color="blue" />
        <Cube position={[0.65, -0.65, -0.65]} size={1} color="yellow" />
      </group>

      <OrbitControls enabled={isCameraEnabled} />
    </Canvas>
  );
};
