import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function UserProfile({ params }) {
    return (_jsxs("div", { children: [_jsx("h2", { children: "User Profile" }), _jsxs("p", { children: ["Hello, ", _jsx("strong", { children: params.user }), "!"] }), _jsx("p", { children: "This page demonstrates dynamic routing and params passing." })] }));
}
