import React from 'react';
import { redirect } from '@snowieedev/vertex-runtime';

export const action = async () => {
  return redirect('/tests/success');
};

export default function RedirectTest() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Redirect Test</h1>
      
      <form method="POST" action="/tests/redirect">
        <button type="submit">Test Redirect</button>
      </form>
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
