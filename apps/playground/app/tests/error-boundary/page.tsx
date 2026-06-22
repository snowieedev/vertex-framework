import React from 'react';

export const loader = async () => {
  throw new Error("Testing Error Boundary");
};

export default function ErrorBoundaryTest() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Error Boundary Test</h1>
      <p>This should not be visible if the error boundary works.</p>
    </div>
  );
}
