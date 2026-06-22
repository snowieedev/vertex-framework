export * from './islands.js';

// Stub out client navigation helpers for Phase 3
// In a fully client-side hydrated app, these would hook into history API.
// For now, they can just perform standard browser navigation since we are server-first.

export function useNavigate() {
  return (path: string, options?: { replace?: boolean }) => {
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.location.replace(path);
      } else {
        window.location.href = path;
      }
    }
  };
}

export function useSubmit() {
  return (form: HTMLFormElement) => {
    if (typeof window !== 'undefined') {
      form.submit();
    }
  };
}
