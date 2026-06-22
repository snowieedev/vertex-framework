export function redirect(url: string, init: number | ResponseInit = 302): Response {
  let responseInit: ResponseInit = {};
  if (typeof init === 'number') {
    responseInit = { status: init };
  } else {
    responseInit = { ...init };
    if (typeof responseInit.status === 'undefined') {
      responseInit.status = 302;
    }
  }

  const headers = new Headers(responseInit.headers);
  headers.set('Location', url);

  return new Response(null, {
    ...responseInit,
    headers,
  });
}

export function permanentRedirect(url: string, init: ResponseInit = {}): Response {
  return redirect(url, { ...init, status: 301 });
}
