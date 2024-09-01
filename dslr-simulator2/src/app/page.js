'use client';

import { useState, useEffect } from 'react';
import DSLRSimulator2 from '../components/DSLRSimulator2';

export default function Home() {
  const [error, setError] = useState(null);

  useEffect(() => {
    window.onerror = (message, source, lineno, colno, error) => {
      setError(`Error: ${message} at ${source}:${lineno}:${colno}`);
    };
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <main className="min-h-screen p-24 bg-white text-black">
      <DSLRSimulator2 />
    </main>
  );
}