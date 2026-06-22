import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const action = async ({ request }) => {
    const formData = await request.formData();
    return {
        name: formData.get('name'),
        email: formData.get('email')
    };
};
export default function FormTest({ actionData }) {
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Form Handling Test" }), _jsxs("form", { method: "POST", action: "/tests/form", style: { display: 'flex', flexDirection: 'column', width: '300px', gap: '1rem' }, children: [_jsxs("label", { children: ["Name: ", _jsx("input", { type: "text", name: "name", required: true })] }), _jsxs("label", { children: ["Email: ", _jsx("input", { type: "email", name: "email", required: true })] }), _jsx("button", { type: "submit", children: "Submit" })] }), actionData && (_jsxs("div", { style: { marginTop: '2rem', background: '#efe', padding: '1rem' }, children: [_jsx("h2", { children: "Received FormData:" }), _jsx("pre", { children: JSON.stringify(actionData, null, 2) })] })), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
