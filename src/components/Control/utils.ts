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
