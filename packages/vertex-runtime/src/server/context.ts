export interface VertexRequestContext {
  /** The incoming Web Request object */
  request: Request;
  /** The parsed URL of the request */
  url: URL;
  /** The matched route parameters (e.g. { id: '123' }) */
  params: Record<string, string | string[]>;
  /** The parsed search parameters from the URL */
  searchParams: URLSearchParams;
  /** The parsed cookies */
  cookies: Record<string, string>;
  // We'll add session here once implemented
  session: any;
}

export type LoaderFunction<T = any> = (context: VertexRequestContext) => Promise<T> | T;
export type ActionFunction<T = any> = (context: VertexRequestContext) => Promise<T> | T;
