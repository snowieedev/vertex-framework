import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const loader = async ({ request }) => {
    const url = new URL(request.url);
    return {
        page: url.searchParams.get('page'),
        sort: url.searchParams.get('sort')
    };
};
export default function SearchTest({ loaderData }) {
    const { page, sort } = loaderData || {};
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "Search Parameters Test" }), _jsxs("div", { style: { marginTop: '1rem', background: '#eef', padding: '1rem' }, children: [_jsxs("p", { children: [_jsx("strong", { children: "Page:" }), " ", page || 'None'] }), _jsxs("p", { children: [_jsx("strong", { children: "Sort:" }), " ", sort || 'None'] })] }), _jsx("br", {}), _jsx("a", { href: "/tests", children: "Back to Tests" })] }));
}
