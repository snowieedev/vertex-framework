import React from 'react';

export default function UserProfile({ params }: { params: { user: string } }) {
  return (
    <div>
      <h2>User Profile</h2>
      <p>Hello, <strong>{params.user}</strong>!</p>
      <p>This page demonstrates dynamic routing and params passing.</p>
    </div>
  );
}
