import React from 'react';

export const loader = async ({ params }: { params: any }) => {
  return { id: params?.id };
};

export default function ParamsTest({ loaderData }: { loaderData: any }) {
  const id = loaderData?.id;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Route Parameters Test</h1>
      
      <div style={{ marginTop: '1rem', background: '#eef', padding: '1rem' }}>
        <h2>Received ID:</h2>
        <p>{id}</p>
      </div>
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
