import React from 'react';

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  return {
    page: url.searchParams.get('page'),
    sort: url.searchParams.get('sort')
  };
};

export default function SearchTest({ loaderData }: { loaderData: any }) {
  const { page, sort } = loaderData || {};
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Search Parameters Test</h1>
      
      <div style={{ marginTop: '1rem', background: '#eef', padding: '1rem' }}>
        <p><strong>Page:</strong> {page || 'None'}</p>
        <p><strong>Sort:</strong> {sort || 'None'}</p>
      </div>
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
