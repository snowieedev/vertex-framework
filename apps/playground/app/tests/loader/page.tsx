import React from 'react';

export const loader = async () => {
  return {
    framework: "Vertex",
    version: "Test",
    status: "Loader Working"
  };
};

export default function LoaderTest({ loaderData }: { loaderData: any }) {
  const data = loaderData || {};
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Loader Test</h1>
      <pre style={{ background: '#eee', padding: '1rem' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
