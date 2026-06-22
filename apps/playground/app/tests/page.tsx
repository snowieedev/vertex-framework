import React from 'react';

export default function TestsHome() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Vertex Phase 3 Test Suite</h1>
      <ul style={{ lineHeight: '1.8' }}>
        <li><a href="/tests/loader">Loader Test</a></li>
        <li><a href="/tests/action">Action Test</a></li>
        <li><a href="/tests/form">Form Test</a></li>
        <li><a href="/tests/params/123">Route Params Test</a></li>
        <li><a href="/tests/search?page=2&sort=name">Search Params Test</a></li>
        <li><a href="/tests/cookies">Cookies Test</a></li>
        <li><a href="/tests/sessions">Sessions Test</a></li>
        <li><a href="/tests/redirect">Redirect Test</a></li>
        <li><a href="/tests/error-boundary">Error Boundary Test</a></li>
        <li><a href="/tests/crud">Simple CRUD Demo</a></li>
      </ul>
    </div>
  );
}
