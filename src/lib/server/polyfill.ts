// URL Polyfill for Nitro/Vinxi SSR on Windows
// Injects a default origin for relative URLs to prevent "TypeError: Invalid URL"

const NativeURL = globalThis.URL;

// @ts-ignore
globalThis.URL = class extends NativeURL {
  constructor(input: string | URL, base?: string | URL) {
    if (typeof input === 'string' && input.startsWith('/') && !base) {
      super(input, process.env.ORIGIN || process.env.APP_URL || 'http://localhost:3000');
    } else {
      super(input, base);
    }
  }
};

// @ts-ignore
globalThis.URL.canParse = NativeURL.canParse;
// @ts-ignore
globalThis.URL.createObjectURL = NativeURL.createObjectURL;
// @ts-ignore
globalThis.URL.revokeObjectURL = NativeURL.revokeObjectURL;
