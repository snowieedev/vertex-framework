'use client';
import React from 'react';

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'red' }}>
      <h1>Error Boundary Working</h1>
      <p>{error?.message || "Testing Error Boundary"}</p>
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
