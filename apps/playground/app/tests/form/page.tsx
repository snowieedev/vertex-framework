import React from 'react';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  return {
    name: formData.get('name'),
    email: formData.get('email')
  };
};

export default function FormTest({ actionData }: { actionData: any }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Form Handling Test</h1>
      
      <form method="POST" action="/tests/form" style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '1rem' }}>
        <label>
          Name: <input type="text" name="name" required />
        </label>
        <label>
          Email: <input type="email" name="email" required />
        </label>
        <button type="submit">Submit</button>
      </form>

      {actionData && (
        <div style={{ marginTop: '2rem', background: '#efe', padding: '1rem' }}>
          <h2>Received FormData:</h2>
          <pre>{JSON.stringify(actionData, null, 2)}</pre>
        </div>
      )}
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
