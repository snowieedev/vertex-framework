import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const loader = async ({ request }) => {
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/theme=([^;]+)/);
    return { theme: match ? match[1] : 'None' };
};
export const action = async ({ request }) => {
    const formData = await request.formData();
    const intent = formData.get('intent');
    if (intent === 'set') {
        // Return a Response with Set-Cookie header
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/tests/cookies',
                'Set-Cookie': 'theme=dark; Path=/'
            }
        });
    }
    return new Response(null, {
        status: 302,
        headers: {
            'Location': '/tests/cookies'
        }
    });
};
export default function CookiesTest({ loaderData }) {
    const theme = loaderData?.theme;
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Cookies Test" }), _jsx("div", { style: { marginTop: '1rem', background: '#eef', padding: '1rem' }, children: _jsxs("p", { children: [_jsx("strong", { children: "Current Cookie (theme):" }), " ", theme] }) }), _jsxs("form", { method: "POST", action: "/tests/cookies", style: { marginTop: '1rem', display: 'flex', gap: '1rem' }, children: [_jsx("button", { type: "submit", name: "intent", value: "set", children: "Set Cookie" }), _jsx("button", { type: "button", onClick: () => window.location.reload(), children: "Read Cookie" })] }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
