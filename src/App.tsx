import { useLayoutEffect, useRef } from 'react';

import * as sphere from './sphere';

function App() {
  const target = useRef<HTMLElement>(null);
  const scene = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (target.current && !scene.current) {
      scene.current = 1;
      sphere.startScene(target.current);
    }

    if (!target.current && !scene.current) {
      throw new Error('No target element found');
    }
  }, []);

  return (
    <>
      <h1>Hello from three.js</h1>
      <main ref={target} />
    </>
  );
}

export default App;
