export interface CookieSerializeOptions {
  domain?: string;
  encode?: (value: string) => string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: true | false | 'lax' | 'strict' | 'none';
  secure?: boolean;
}

export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  const pairs = header.split(';');
  for (const pair of pairs) {
    const splitIndex = pair.indexOf('=');
    if (splitIndex < 0) continue;
    
    const key = pair.slice(0, splitIndex).trim();
    let val = pair.slice(splitIndex + 1).trim();
    
    if (val[0] === '"') {
      val = val.slice(1, -1);
    }
    
    if (cookies[key] === undefined) {
      cookies[key] = decodeURIComponent(val);
    }
  }

  return cookies;
}

export function serializeCookie(name: string, val: string, options: CookieSerializeOptions = {}): string {
  const enc = options.encode || encodeURIComponent;
  let str = `${name}=${enc(val)}`;

  if (options.maxAge != null) {
    str += `; Max-Age=${Math.floor(options.maxAge)}`;
  }
  if (options.domain) {
    str += `; Domain=${options.domain}`;
  }
  if (options.path) {
    str += `; Path=${options.path}`;
  }
  if (options.expires) {
    str += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.httpOnly) {
    str += `; HttpOnly`;
  }
  if (options.secure) {
    str += `; Secure`;
  }
  if (options.sameSite) {
    const sameSite = typeof options.sameSite === 'string' ? options.sameSite.toLowerCase() : options.sameSite;
    switch (sameSite) {
      case true:
      case 'strict':
        str += `; SameSite=Strict`;
        break;
      case 'lax':
        str += `; SameSite=Lax`;
        break;
      case 'none':
        str += `; SameSite=None`;
        break;
    }
  }

  return str;
}
