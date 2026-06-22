import React from 'react';
import { VertexRequestContext, redirect, ActionFunction, LoaderFunction } from '@snowieedev/vertex-runtime';
import { getUser, updateUser } from '../../db.js';

export const loader: LoaderFunction = async ({ params, session }) => {
  const id = params.id as string;
  const user = await getUser(id);
  
  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  const message = session?.get('message');
  return { user, message };
};

export const action: ActionFunction = async ({ request, params, session }) => {
  const id = params.id as string;
  const formData = await request.formData();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  await updateUser(id, name, email);
  session?.flash('message', 'User updated successfully!');
  
  return redirect(`/users/${id}`);
};

export default function EditUserPage({ loaderData }: { loaderData: any }) {
  const { user, message } = loaderData;

  return (
    <div>
      <h2>Edit User: {user.name}</h2>
      {message && <div className="message">{message}</div>}
      
      <form method="POST" action={`/users/${user.id}`}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Name</label>
          <input type="text" name="name" defaultValue={user.name} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Email</label>
          <input type="email" name="email" defaultValue={user.email} required style={{ width: '100%' }} />
        </div>
        
        <button type="submit">Save Changes</button>
        <a href="/" style={{ marginLeft: '1rem' }}>Back to Users</a>
      </form>
    </div>
  );
}
