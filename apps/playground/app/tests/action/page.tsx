import React from 'react';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const value = formData.get('testInput');
  return { submittedValue: value };
};

export default function ActionTest({ actionData }: { actionData: any }) {
  const submittedValue = actionData?.submittedValue;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Action Test</h1>
      <form method="POST" action="/tests/action">
        <label>
          Test Input: <input type="text" name="testInput" />
        </label>
        <button type="submit" style={{ marginLeft: '1rem' }}>Submit</button>
      </form>
      
      {submittedValue && (
        <div style={{ marginTop: '2rem', background: '#eef', padding: '1rem' }}>
          <h2>Submitted:</h2>
          <p>{submittedValue}</p>
        </div>
      )}
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
