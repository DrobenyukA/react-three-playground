import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader, Vector3, Plane, Raycaster, Vector2 } from "three";
import {
  useThree,
  ThreeEvent,
  useLoader,
  GroupProps,
} from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";

interface Props {
  position: [number, number, number];
  radius?: number;
  color?: string;
  borderColor?: string;
}

export const Control = ({
  radius = 0.25,
  position: initialPosition,
}: Props) => {
  const [position, setPosition] = useState(initialPosition);
  const { size, camera } = useThree();
  const iconTexture = useLoader(TextureLoader, "/slope.png");
  const [spring, api] = useSpring(() => ({ position }), [position]);

  const planeIntersectPoint = useRef(new Vector3());
  const plane = useMemo(
    () => new Plane(new Vector3(0, 0, 1), -initialPosition[2]),
    [initialPosition]
  );
  const raycaster = useMemo(() => new Raycaster(), []);
  const dragOffset = useRef(0);

  const bind = useDrag(({ xy: [clientX, clientY], first, down }) => {
    const x = (clientX / size.width) * 2 - 1;
    const y = -(clientY / size.height) * 2 + 1;

    raycaster.setFromCamera(new Vector2(x, y), camera);
    raycaster.ray.intersectPlane(plane, planeIntersectPoint.current);

    if (planeIntersectPoint.current) {
      if (first) {
        dragOffset.current = planeIntersectPoint.current.y - position[1];
      }

      const newY = planeIntersectPoint.current.y - dragOffset.current;
      const newPosition: [number, number, number] = [
        position[0],
        newY,
        position[2],
      ];

      api.start({
        position: newPosition,
        immediate: down,
        onRest: () => {
          if (!down) {
            setPosition(newPosition);
          }
        },
      });
    }
  });

  const { onPointerDown, onPointerUp, ...boundAttributes } = bind();

  const handlePointerDown = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      document.dispatchEvent(new CustomEvent("disable-camera"));
      if (onPointerDown) onPointerDown(event as unknown as React.PointerEvent);
    },
    [onPointerDown]
  );

  const handlePointerUp = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      document.dispatchEvent(new CustomEvent("enable-camera"));
      if (onPointerUp) onPointerUp(event as unknown as React.PointerEvent);
    },
    [onPointerUp]
  );

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition[0], initialPosition[1], initialPosition[2]]);

  return (
    <animated.group
      {...(spring as unknown as GroupProps)}
      {...(boundAttributes as unknown as Partial<GroupProps>)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <sprite scale={[radius * 2, radius * 2, 1]}>
        <spriteMaterial
          map={iconTexture}
          depthTest={false}
          transparent
          opacity={0.9}
        />
      </sprite>
    </animated.group>
  );
};
