'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Error({ error }) {
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif', color: 'red' }, children: [_jsx("h1", { children: "Error Boundary Working" }), _jsx("p", { children: error?.message || "Testing Error Boundary" }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
