import { defineConfig, loadEnv } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import tailwindcss from "@tailwindcss/vite";

const SERVER_ONLY = [
  "drizzle-orm",
  "mysql2",
  "mysql2/promise",
  "jose",
  "zod",
  "argon2",
  "uuid",
];

const SERVER_ENV_KEYS = [
  "PORT",
  "APP_URL",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "SESSION_COOKIE_NAME",
  "UPLOAD_DIR",
  "MAX_FILE_SIZE_MB",
] as const;

export default defineConfig(({ command, mode }) => {
  if (command === "build") {
    process.env.NODE_ENV = "production";
  }

  const env = loadEnv(mode, process.cwd(), "");

  for (const key of SERVER_ENV_KEYS) {
    if (env[key] !== undefined && process.env[key] === undefined) {
      process.env[key] = env[key];
    }
  }

  const origin = process.env.ORIGIN || process.env.APP_URL || `http://localhost:${env.PORT || 3000}`;
  process.env.ORIGIN = origin;
  process.env.NITRO_URL = origin;

  const nitroPreset = env.NITRO_PRESET || "node-server";

  return {
    server: {
      host: true,
      port: Number(env.PORT) || 3000,
    },
    plugins: [
      tailwindcss(),
      solidStart({
        middleware: "./src/middleware/index.ts",
      }),
      nitro({
        preset: nitroPreset,
        // Nitro's moduleSideEffects(id) returns false for entry-server.js
        // (not in runtimeDir), causing Rollup to tree-shake Meta/Title out of
        // entry.mjs while keeping the export statement → SyntaxError at runtime.
        // treeshake:false prevents this.
        rollupConfig: {
          treeshake: false,
        },
        // Fix TypeError: Invalid URL – see src/server/plugins/url-fix.ts
        plugins: ["./src/server/plugins/url-fix.ts"],
        routeRules: {
          "/**": {
            headers: {
              "X-Frame-Options":        "DENY",
              "X-Content-Type-Options": "nosniff",
              "Referrer-Policy":        "strict-origin-when-cross-origin",
              "X-DNS-Prefetch-Control": "off",
              "Permissions-Policy":     "camera=(), microphone=(), geolocation=(self)",
              "Content-Security-Policy":
                "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
            },
          },
          "/dashboard/**": {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          },
        },
      }),
    ],
    environments: {
      ssr: {
        // Only override DEV/PROD during `vite build`.  In dev mode the SSR
        // environment must have DEV=true so SolidStart uses its Vite-served
        // dev manifest (getSsrDevManifest).  Forcing DEV=false in dev causes
        // getSsrProdManifest to run, which looks for a client Vite manifest
        // that doesn't exist yet → "No entry found in vite manifest" error.
        // During the build step the intermediate SSR bundle still reports
        // DEV=true, which would make the prod server try to load the dev
        // manifest at runtime (no Vite server → ERR_MODULE_NOT_FOUND), so
        // we must stamp DEV=false/PROD=true only for the build.
        define: command === "build" ? {
          "import.meta.env.DEV": "false",
          "import.meta.env.PROD": "true",
        } : {},
      },
    },
    ssr: {
      external: SERVER_ONLY,
      noExternal: ["lucide-solid"],
    },
    build: {
      rollupOptions: {
        external: (id) =>
          SERVER_ONLY.some((pkg) => id === pkg || id.startsWith(pkg + "/")),
      },
    },
    optimizeDeps: {
      exclude: SERVER_ONLY,
    },
  };
});
