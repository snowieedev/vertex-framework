import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const loader = async ({ params }) => {
    return { id: params?.id };
};
export default function ParamsTest({ loaderData }) {
    const id = loaderData?.id;
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Route Parameters Test" }), _jsxs("div", { style: { marginTop: '1rem', background: '#eef', padding: '1rem' }, children: [_jsx("h2", { children: "Received ID:" }), _jsx("p", { children: id })] }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
