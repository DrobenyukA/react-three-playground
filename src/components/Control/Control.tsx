import { useCallback, useEffect, useMemo, useState } from 'react';
import { Vector3 as ThreeVector3 } from 'three';
import { Vector3, Color, useThree, ThreeEvent } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/three';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

import { calculatePosition } from './utils';

interface Props {
  position: Vector3;
  radius?: number;
  segments?: number;
  color: Color;
  borderColor?: string;
}

const SENSITIVITY = 0.15;

export const Control = ({ radius = 0.25, segments = 50, color, ...props }: Props) => {
  const [position, setPosition] = useState(props.position);
  const { size, viewport } = useThree();
  const aspect = (size.width / viewport.width) * SENSITIVITY;

  const circleArgs = useMemo(() => [radius, segments] as [number, number], [radius, segments]);

  const [spring, api] = useSpring(() => ({ position }), [position]);

  const bind = useDrag(
    ({ delta: [, deltaY], timeStamp, down, event, direction }) => {
      const currentPosition = get(
        event,
        'object.position',
        new ThreeVector3(get(position, '0', 0), get(position, '1', 0), get(position, '2', 0)),
      );
      const x = currentPosition.x;
      const y = calculatePosition(currentPosition.y, deltaY, direction, aspect);
      const z = currentPosition.z;
      api.start({ position: [x, y, z] });

      if (!down) {
        setPosition([x, currentPosition.y, z]);
      }

      return timeStamp;
    },
    { delay: true },
  );
  const { onPointerDown, onPointerUp, ...boundAttributes } = bind();

  const handlePointerDown = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      document.dispatchEvent(new CustomEvent('disable-camera'));
      if (isFunction(onPointerDown)) {
        // @ts-expect-error due to type incompatibility between react-three-fiber and react-spring
        onPointerDown(event);
      }
    },
    [onPointerDown],
  );

  const handlePointerUp = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      document.dispatchEvent(new CustomEvent('enable-camera'));

      if (isFunction(onPointerUp)) {
        // @ts-expect-error due to type incompatibility between react-three-fiber and react-spring
        onPointerUp(event);
      }
    },
    [onPointerUp],
  );

  useEffect(() => {
    setPosition(props.position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get(props.position, '0'), get(props.position, '1'), get(props.position, '2')]);

  return (
    // @ts-expect-error due to type incompatibility between react-three-fiber and react-spring
    <animated.mesh
      {...spring}
      {...boundAttributes}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <circleGeometry args={circleArgs} />
      <meshToonMaterial color={color} emissive={0x000000} fog />
    </animated.mesh>
  );
};
