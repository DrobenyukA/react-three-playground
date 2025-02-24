// import { useRef } from 'react';

import { Basics } from './components/Basics';

// import { useSphere } from './sphere';

function App() {
  // const target = useRef<HTMLElement>(null);
  // useSphere(target);
  return (
    <>
      <h1>Hello from three.js</h1>
      {/* <main ref={target} /> */}
      <main>
        <Basics />
      </main>
    </>
  );
}

export default App;
