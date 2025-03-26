import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CurvePath,
  LineCurve3,
  MeshBasicMaterial,
  Vector3 as ThreeVector3,
  TubeGeometry,
  Vector3,
} from 'three';
import { Color, useThree, ThreeEvent } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/three';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

import { calculatePosition } from './utils';

interface Props {
  position: [number, number, number];
  radius?: number;
  segments?: number;
  color: Color;
  borderColor?: string;
}

const SENSITIVITY = 0.15;

export const Control = ({ radius = 0.25, segments = 50, color, borderColor, ...props }: Props) => {
  const [position, setPosition] = useState<[number, number, number]>(props.position);
  const { size, viewport } = useThree();
  const aspect = (size.width / viewport.width) * SENSITIVITY;

  const circleArgs = useMemo(() => [radius, segments] as [number, number], [radius, segments]);

  const tube = useMemo(() => {
    const curve = new CurvePath<ThreeVector3>();
    const points = [];
    const width = 0.0125;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      points.push(new Vector3(x, y, 0));
    }

    for (let i = 0; i < points.length - 1; i++) {
      curve.add(new LineCurve3(points[i], points[i + 1]));
    }

    return {
      geometry: new TubeGeometry(curve, segments, width, 8, false),
      material: new MeshBasicMaterial({ color: borderColor }),
    };
  }, [radius, segments]);

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
    <animated.group
      {...spring}
      {...boundAttributes}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <animated.mesh {...spring}>
        <circleGeometry args={circleArgs} />
        <meshToonMaterial color={color} emissive={0x000000} fog />
      </animated.mesh>

      <animated.mesh {...spring} {...tube} />
    </animated.group>
  );
};
