export default function() {
  const origin = process.env.ORIGIN || process.env.APP_URL || "http://localhost:3000";
  
  if (typeof globalThis.URL.canParse === "undefined" || !globalThis.URL.canParse("/")) {
    const NativeURL = globalThis.URL;
    // @ts-ignore
    globalThis.URL = class extends NativeURL {
      constructor(input: string | URL, base?: string | URL) {
        if (typeof input === "string" && !input.includes("://") && !base) {
          try {
            // @ts-ignore
            super(input, origin);
          } catch (e) {
            // @ts-ignore
            super(input, "http://localhost");
          }
        } else {
          super(input, base);
        }
      }
    };
  }
}
