import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const loader = async () => {
    return {
        framework: "Vertex",
        version: "Test",
        status: "Loader Working"
    };
};
export default function LoaderTest({ loaderData }) {
    const data = loaderData || {};
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Loader Test" }), _jsx("pre", { style: { background: '#eee', padding: '1rem' }, children: JSON.stringify(data, null, 2) }), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
