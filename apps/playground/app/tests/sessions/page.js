import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { redirect } from '@snowieedev/vertex-runtime';
export const loader = async ({ session }) => {
    const username = session?.get('username');
    return { username };
};
export const action = async ({ request, session }) => {
    const formData = await request.formData();
    const intent = formData.get('intent');
    if (intent === 'login') {
        session?.set('username', 'Vertex Tester');
    }
    else if (intent === 'logout') {
        session?.delete('username'); // or set to null
    }
    return redirect('/tests/sessions');
};
export default function SessionsTest({ loaderData }) {
    const username = loaderData?.username;
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Sessions Test" }), _jsx("div", { style: { marginTop: '1rem', background: '#eef', padding: '1rem' }, children: username ? (_jsxs("p", { children: ["Logged in as ", _jsx("strong", { children: username })] })) : (_jsx("p", { children: "Not logged in." })) }), _jsx("form", { method: "POST", action: "/tests/sessions", style: { marginTop: '1rem', display: 'flex', gap: '1rem' }, children: !username ? (_jsx("button", { type: "submit", name: "intent", value: "login", children: "Login" })) : (_jsx("button", { type: "submit", name: "intent", value: "logout", children: "Logout" })) }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
