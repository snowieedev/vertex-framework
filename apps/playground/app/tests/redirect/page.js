import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { redirect } from '@snowieedev/vertex-runtime';
export const action = async () => {
    return redirect('/tests/success');
};
export default function RedirectTest() {
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Redirect Test" }), _jsx("form", { method: "POST", action: "/tests/redirect", children: _jsx("button", { type: "submit", children: "Test Redirect" }) }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
