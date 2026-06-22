import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const action = async ({ request }) => {
    const formData = await request.formData();
    const value = formData.get('testInput');
    return { submittedValue: value };
};
export default function ActionTest({ actionData }) {
    const submittedValue = actionData?.submittedValue;
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Action Test" }), _jsxs("form", { method: "POST", action: "/tests/action", children: [_jsxs("label", { children: ["Test Input: ", _jsx("input", { type: "text", name: "testInput" })] }), _jsx("button", { type: "submit", style: { marginLeft: '1rem' }, children: "Submit" })] }), submittedValue && (_jsxs("div", { style: { marginTop: '2rem', background: '#eef', padding: '1rem' }, children: [_jsx("h2", { children: "Submitted:" }), _jsx("p", { children: submittedValue })] })), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
