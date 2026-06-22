import React from 'react';
import { VertexRequestContext, redirect, ActionFunction, LoaderFunction, serializeCookie } from '@snowieedev/vertex-runtime';
import { getUsers, createUser, deleteUser } from './db.js';

export const loader: LoaderFunction = async ({ session }) => {
  const users = await getUsers();
  const error = session?.get('error');
  const message = session?.get('message');
  return { users, error, message };
};

export const action: ActionFunction = async ({ request, session }) => {
  const formData = await request.formData();
  console.log('Action received formData:', Array.from(formData.entries()));
  
  const intent = formData.get('intent');

  if (intent === 'create') {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    if (!name || !email) {
      session?.flash('error', 'Name and email are required');
    } else {
      await createUser(name, email);
      session?.flash('message', 'User created successfully!');
    }
  } else if (intent === 'delete') {
    const id = formData.get('id') as string;
    await deleteUser(id);
    session?.flash('message', 'User deleted successfully!');
  }
  
  // Create response with updated session cookie (hacky implementation for demo)
  // In a full implementation, session.commit() would be used to generate the cookie string
  // Here we just redirect to '/'
  return redirect('/');
};

export default function Page({ loaderData }: { loaderData: any }) {
  const { users, error, message } = loaderData || { users: [] };

  return (
    <div>
      <h2>Users</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      
      <form method="POST" action="/">
        <input type="hidden" name="intent" value="create" />
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong> ({user.email})
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={`/users/${user.id}`}>Edit</a>
              <form method="POST" action="/" style={{ margin: 0 }}>
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" style={{ background: '#ff4444', color: 'white', border: 'none' }}>
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
