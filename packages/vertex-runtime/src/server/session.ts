import { CookieSerializeOptions, serializeCookie, parseCookies } from './cookies.js';

export interface SessionData {
  [key: string]: any;
}

export interface Session {
  readonly id: string;
  readonly data: SessionData;
  readonly isNew: boolean;
  has(name: string): boolean;
  get(name: string): any;
  set(name: string, value: any): void;
  flash(name: string, value: any): void;
  unset(name: string): void;
  destroy(): void;
}

export interface SessionStorage {
  getSession(cookieHeader: string | null): Promise<Session>;
  commitSession(session: Session, options?: CookieSerializeOptions): Promise<string>;
  destroySession(session: Session, options?: CookieSerializeOptions): Promise<string>;
}

export interface CookieSessionStorageOptions {
  cookie: CookieSerializeOptions & { name: string; secrets?: string[] };
}

// A simple cookie-based session storage without encryption for now
// In a production app, we would encrypt/sign this cookie using the secrets.
export function createCookieSessionStorage({ cookie: cookieOptions }: CookieSessionStorageOptions): SessionStorage {
  return {
    async getSession(cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      const sessionCookie = cookies[cookieOptions.name];
      let data: SessionData = {};
      let isNew = true;
      let id = Math.random().toString(36).substring(2);

      if (sessionCookie) {
        try {
          const parsed = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
          data = parsed.data || {};
          id = parsed.id || id;
          isNew = false;
        } catch (e) {
          // invalid cookie
        }
      }

      return createSession(data, id, isNew);
    },

    async commitSession(session, options) {
      const payload = { id: session.id, data: session.data };
      const serializedData = Buffer.from(JSON.stringify(payload)).toString('base64');
      return serializeCookie(cookieOptions.name, serializedData, {
        ...cookieOptions,
        ...options,
      });
    },

    async destroySession(session, options) {
      return serializeCookie(cookieOptions.name, '', {
        ...cookieOptions,
        ...options,
        expires: new Date(0),
        maxAge: 0,
      });
    }
  };
}

function createSession(initialData: SessionData, id: string, isNew: boolean): Session {
  const data = { ...initialData };
  let destroyed = false;

  return {
    get id() {
      return id;
    },
    get data() {
      return data;
    },
    get isNew() {
      return isNew;
    },
    has(name) {
      return name in data;
    },
    get(name) {
      return data[name];
    },
    set(name, value) {
      if (destroyed) throw new Error('Cannot set on destroyed session');
      data[name] = value;
    },
    flash(name, value) {
      this.set(`__flash_${name}`, value);
    },
    unset(name) {
      if (destroyed) throw new Error('Cannot unset on destroyed session');
      delete data[name];
    },
    destroy() {
      destroyed = true;
      for (const key of Object.keys(data)) {
        delete data[key];
      }
    }
  };
}
