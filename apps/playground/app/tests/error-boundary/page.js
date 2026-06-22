import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const loader = async () => {
    throw new Error("Testing Error Boundary");
};
export default function ErrorBoundaryTest() {
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Error Boundary Test" }), _jsx("p", { children: "This should not be visible if the error boundary works." })] }));
}
