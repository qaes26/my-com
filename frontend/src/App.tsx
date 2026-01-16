import { useState } from 'react';
import IDELayout from './components/IDELayout';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started ? (
        <WelcomeScreen onStart={() => setStarted(true)} />
      ) : (
        <IDELayout />
      )}
    </>
  );
}

export default App;
