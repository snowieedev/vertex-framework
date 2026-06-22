import React from 'react';
import { redirect } from '@snowieedev/vertex-runtime';

export const loader = async ({ session }: { session: any }) => {
  const username = session?.get('username');
  return { username };
};

export const action = async ({ request, session }: { request: Request, session: any }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'login') {
    session?.set('username', 'Vertex Tester');
  } else if (intent === 'logout') {
    session?.delete('username'); // or set to null
  }
  
  return redirect('/tests/sessions');
};

export default function SessionsTest({ loaderData }: { loaderData: any }) {
  const username = loaderData?.username;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Sessions Test</h1>
      
      <div style={{ marginTop: '1rem', background: '#eef', padding: '1rem' }}>
        {username ? (
          <p>Logged in as <strong>{username}</strong></p>
        ) : (
          <p>Not logged in.</p>
        )}
      </div>
      
      <form method="POST" action="/tests/sessions" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        {!username ? (
          <button type="submit" name="intent" value="login">Login</button>
        ) : (
          <button type="submit" name="intent" value="logout">Logout</button>
        )}
      </form>
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
