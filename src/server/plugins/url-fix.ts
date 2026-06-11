// Nitro plugin: bridge the h3 v1 (Nitro) / h3 v2 (SolidStart) API mismatch.
//
// WHY: @solidjs/vite-plugin-nitro-2 generates a virtual entry:
//   import { fromWebHandler } from 'h3'   ← resolves to h3 v2
//   export default fromWebHandler(handler.fetch)
//
// h3 v2's fromWebHandler is:
//   function(event) { return handler(event.req, event.context) }
// When Nitro/h3 v1 calls this with a h3 v1 event, `event.req` is a Node.js
// IncomingMessage (not a Web Request).  handler.fetch = app2.fetch (h3 v2 H3 app)
// then creates a h3 v2 H3Event from that IncomingMessage:
//   new FastURL(req.url)          → fails if url="/"
//   event.req.headers.get(...)    → fails (plain obj, no .get())
//
// FIX: In the Nitro `request` hook, snapshot nodeReq.url into an absolute URL
// BEFORE h3 v1's createAppEventHandler overwrites it with the relative _layerPath,
// then build a proper Web Request from that snapshot.  Shadow event.req so that
// _webHandler passes the Web Request to h3 v2's app.fetch:
//   _webHandler(h3v1Event)  →  app2.fetch(webRequest)
//   → h3v2 H3Event.req = webRequest  (Web Request, all APIs work)
//
// IMPORTANT: We do NOT install a no-op setter on nodeReq.url.  Blocking h3 v1's
// _layerPath reset caused event.path to return the full absolute URL, which broke
// getRouteRulesForPath → _routeRulesMatcher.matchAll(absoluteURL) returned null
// → defu spread crashed with "Cannot read properties of null (reading 'push')".
//
// DEPRECATION WARNING FIX:
// Nitro uses h3 v1 internally.  h3 v1's toEventHandler() checks for the
// __is_handler__ brand flag (set by h3 v1's eventHandler()) before registering
// a renderer.  The fromWebHandler() result from h3 v2 is a plain function with
// no such flag, causing:
//   "[h3] Implicit event handler conversion is deprecated."
// The warning fires inside lazyEventHandler's resolution path on the very first
// request — before any Nitro lifecycle hook we could use to pre-stamp the flag.
// We suppress it via a targeted console.warn interceptor (see plugin body below).

export default (nitroApp: any) => {
  // h3 v1 (bundled inside nitropack) emits a deprecation warning when it calls
  // toEventHandler() on the _webHandler returned by h3 v2's fromWebHandler().
  // The function lacks the __is_handler__ = true brand that h3 v1's eventHandler()
  // sets. The warning fires inside lazyEventHandler's resolution path on the first
  // request, before any accessible Nitro lifecycle hook.
  //
  // Fix: intercept console.warn and suppress the single known false-positive.
  // We match the exact h3 v1 prefix so no other warnings are affected.
  const _warn = console.warn.bind(console);
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("[h3] Implicit event handler conversion is deprecated")
    ) {
      return;
    }
    _warn(...args);
  };

  nitroApp.hooks.hook("request", (event: any) => {
    const nodeReq = event.node?.req;
    if (!nodeReq) return;

    // Snapshot nodeReq.url NOW — before h3 v1's createAppEventHandler resets it
    // to the relative _layerPath.  The Web Request is built from this snapshot
    // so h3 v2 always receives a fully-qualified URL.
    const rawPath = nodeReq.url || "/";
    const isAbsolute =
      rawPath.startsWith("http://") || rawPath.startsWith("https://");
    const host = nodeReq.headers?.host || "localhost";
    const protocol = nodeReq.socket?.encrypted ? "https" : "http";
    const absoluteURL = isAbsolute ? rawPath : `${protocol}://${host}${rawPath}`;

    // Convert Node headers (plain object) to Web Headers.
    const webHeaders = new Headers();
    for (const [key, val] of Object.entries(nodeReq.headers || {})) {
      if (Array.isArray(val)) {
        for (const v of val) webHeaders.append(key, v);
      } else if (val != null) {
        webHeaders.set(key, String(val));
      }
    }

    const method = (nodeReq.method || "GET").toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";

    // Build a proper Web Request.  For request bodies we stream the Node
    // IncomingMessage through a ReadableStream so formData/json/text work.
    let webRequest: Request;
    if (hasBody) {
      const body = new ReadableStream({
        start(controller) {
          nodeReq.on("data", (chunk: Buffer) =>
            controller.enqueue(new Uint8Array(chunk))
          );
          nodeReq.on("end", () => controller.close());
          nodeReq.on("error", (err: Error) => controller.error(err));
        },
      });
      // duplex:'half' is required by Node.js 18+ for streaming request bodies.
      webRequest = new Request(absoluteURL, {
        method,
        headers: webHeaders,
        // @ts-ignore — duplex not in TS lib yet
        body,
        duplex: "half",
      });
    } else {
      webRequest = new Request(absoluteURL, { method, headers: webHeaders });
    }

    // Shadow h3 v1's event.req getter (returns Node IncomingMessage) with our
    // Web Request.  When _webHandler calls handler(event.req, event.context),
    // h3 v2's app receives a proper Web Request → headers.get() etc. all work.
    Object.defineProperty(event, "req", {
      configurable: true,
      enumerable: true,
      get: () => webRequest,
    });
  });
};
