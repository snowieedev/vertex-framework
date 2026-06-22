import React from 'react';
import { serializeCookie } from '@snowieedev/vertex-runtime';

export const loader = async ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/theme=([^;]+)/);
  return { theme: match ? match[1] : 'None' };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'set') {
    // Return a Response with Set-Cookie header
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/tests/cookies',
        'Set-Cookie': 'theme=dark; Path=/'
      }
    });
  }
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/tests/cookies'
    }
  });
};

export default function CookiesTest({ loaderData }: { loaderData: any }) {
  const theme = loaderData?.theme;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Cookies Test</h1>
      
      <div style={{ marginTop: '1rem', background: '#eef', padding: '1rem' }}>
        <p><strong>Current Cookie (theme):</strong> {theme}</p>
      </div>
      
      <form method="POST" action="/tests/cookies" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button type="submit" name="intent" value="set">Set Cookie</button>
        <button type="button" onClick={() => window.location.reload()}>Read Cookie</button>
      </form>
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
