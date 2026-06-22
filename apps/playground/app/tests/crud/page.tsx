import React from 'react';

// In-memory array for our CRUD demo
let todos: { id: string; text: string; completed: boolean }[] = [];

export const loader = async () => {
  return { todos };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'add') {
    const text = formData.get('text') as string;
    if (text) {
      todos.push({
        id: Math.random().toString(36).substring(7),
        text,
        completed: false
      });
    }
  } else if (intent === 'delete') {
    const id = formData.get('id') as string;
    todos = todos.filter(t => t.id !== id);
  } else if (intent === 'toggle') {
    const id = formData.get('id') as string;
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  // We could redirect or return updated state. In standard Vertex patterns we often redirect or just let it re-render.
  return { todos };
};

export default function CRUDTest({ loaderData, actionData }: { loaderData: any, actionData: any }) {
  const currentTodos = actionData?.todos || loaderData?.todos || [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Simple CRUD Demo</h1>
      
      <form method="POST" action="/tests/crud" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input type="hidden" name="intent" value="add" />
        <input type="text" name="text" placeholder="New Todo" required />
        <button type="submit">Add Todo</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentTodos.map((todo: any) => (
          <li key={todo.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', background: '#f9f9f9', padding: '0.5rem' }}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flexGrow: 1 }}>
              {todo.text}
            </span>
            
            <form method="POST" action="/tests/crud" style={{ margin: 0 }}>
              <input type="hidden" name="intent" value="toggle" />
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit">{todo.completed ? 'Undo' : 'Complete'}</button>
            </form>
            
            <form method="POST" action="/tests/crud" style={{ margin: 0 }}>
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" style={{ background: '#fdd', color: '#a00', border: '1px solid #f99' }}>Delete</button>
            </form>
          </li>
        ))}
      </ul>

      {currentTodos.length === 0 && <p>No todos yet.</p>}
      
      <br />
      <a href="/tests">Back to Tests</a>
    </div>
  );
}
