import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// In-memory array for our CRUD demo
let todos = [];
export const loader = async () => {
    return { todos };
};
export const action = async ({ request }) => {
    const formData = await request.formData();
    const intent = formData.get('intent');
    if (intent === 'add') {
        const text = formData.get('text');
        if (text) {
            todos.push({
                id: Math.random().toString(36).substring(7),
                text,
                completed: false
            });
        }
    }
    else if (intent === 'delete') {
        const id = formData.get('id');
        todos = todos.filter(t => t.id !== id);
    }
    else if (intent === 'toggle') {
        const id = formData.get('id');
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    }
    // We could redirect or return updated state. In standard Vertex patterns we often redirect or just let it re-render.
    return { todos };
};
export default function CRUDTest({ loaderData, actionData }) {
    const currentTodos = actionData?.todos || loaderData?.todos || [];
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Simple CRUD Demo" }), _jsxs("form", { method: "POST", action: "/tests/crud", style: { marginBottom: '1rem', display: 'flex', gap: '0.5rem' }, children: [_jsx("input", { type: "hidden", name: "intent", value: "add" }), _jsx("input", { type: "text", name: "text", placeholder: "New Todo", required: true }), _jsx("button", { type: "submit", children: "Add Todo" })] }), _jsx("ul", { style: { listStyle: 'none', padding: 0 }, children: currentTodos.map((todo) => (_jsxs("li", { style: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', background: '#f9f9f9', padding: '0.5rem' }, children: [_jsx("span", { style: { textDecoration: todo.completed ? 'line-through' : 'none', flexGrow: 1 }, children: todo.text }), _jsxs("form", { method: "POST", action: "/tests/crud", style: { margin: 0 }, children: [_jsx("input", { type: "hidden", name: "intent", value: "toggle" }), _jsx("input", { type: "hidden", name: "id", value: todo.id }), _jsx("button", { type: "submit", children: todo.completed ? 'Undo' : 'Complete' })] }), _jsxs("form", { method: "POST", action: "/tests/crud", style: { margin: 0 }, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: todo.id }), _jsx("button", { type: "submit", style: { background: '#fdd', color: '#a00', border: '1px solid #f99' }, children: "Delete" })] })] }, todo.id))) }), currentTodos.length === 0 && _jsx("p", { children: "No todos yet." }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
