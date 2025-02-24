import { useCallback, useEffect, useRef, useState } from 'react';
import { Vector3, BoxGeometryProps, Color, ThreeEvent } from '@react-three/fiber';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';

interface Props {
  position: Vector3;
  size: number | BoxGeometryProps['args'];
  color: Color;
}

const getSize = (size: number | BoxGeometryProps['args']): BoxGeometryProps['args'] =>
  Array.isArray(size) ? size : [size, size, size];

export const Cube = ({ position, size, color }: Props) => {
  const [state, setState] = useState({ isHovered: false, isActive: false });

  const handlePointerDown = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    document.dispatchEvent(new CustomEvent('disable-camera'));
    setState((prevState) => ({ ...prevState, isActive: true }));
  }, []);

  const handlePointerUp = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    document.dispatchEvent(new CustomEvent('enable-camera'));
    setState((prevState) => ({ ...prevState, isActive: false }));
  }, []);

  const handlePointerEnter = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setState((prevState) => ({ ...prevState, isHovered: true }));
  }, []);

  const handlePointerLeave = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setState((prevState) => ({ ...prevState, isHovered: false }));
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      if (state.isActive && ref.current) {
        ref.current.position.y += -event.movementY / 100;
      }
    },
    [state.isActive],
  );

  const ref =
    useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(
      null,
    );

  //   useFrame((rootState, delta) => {
  //     if (ref.current && !state.isActive) {
  //       ref.current.rotation.x += delta;
  //       ref.current.rotation.y -= delta;
  //       ref.current.position.z = Math.cos(rootState.clock.getElapsedTime()) * 2;
  //     }
  //   });

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state.isActive]);

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <boxGeometry args={getSize(size)} />
      <meshStandardMaterial color={state.isHovered ? 'white' : color} />
    </mesh>
  );
};
