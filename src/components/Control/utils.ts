import { Vector3 } from 'three';

const isMovingUp = ([, y]: [number, number]) => y === -1;

const isMovingDown = ([, y]: [number, number]) => y === 1;

export const calculatePosition = (
  targetY: number,
  deltaY: number,
  direction: [number, number],
  aspect: number,
) => {
  if (isMovingUp(direction)) {
    return targetY + -deltaY / aspect;
  }

  if (isMovingDown(direction)) {
    return targetY - deltaY / aspect;
  }

  return targetY;
};

export const createTriangleIcon = (radius: number) => {
  const top = radius * 0.72;
  const right = top;
  const bottom = top * -1;
  const left = right * -1;
  const bottomOffset = radius * 0.2 * -1;
  return [
    new Vector3(0, top, 0),
    new Vector3(right, bottomOffset, 0),
    new Vector3(0, bottom, 0),
    new Vector3(0, top, 0),
    new Vector3(left, bottomOffset, 0),
    new Vector3(0, bottom, 0),
  ];
};

export const createDiamondIcon = (radius: number) => {
  const top = radius * 0.9;
  const right = radius * 0.5;
  const bottom = top * -1;
  const left = right * -1;

  return [
    new Vector3(0, top, 0),
    new Vector3(right, 0, 0),
    new Vector3(0, bottom, 0),
    new Vector3(0, top, 0),

    new Vector3(left, 0, 0),
    new Vector3(0, bottom, 0),
    new Vector3(0, 0, 0),
    new Vector3(left, 0, 0),
    new Vector3(right, 0, 0),
  ];
};
