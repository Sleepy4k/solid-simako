import { defineConfig, loadEnv } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

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

  return {
    server: {
      host: true,
      port: Number(env.PORT) || 3000,
    },
    plugins: [
      solidStart({
        middleware: "./src/middleware/index.ts",
      }),
      tailwindcss(),
      nitro({
        preset: "node-server",
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
    ssr: {
      external: SERVER_ONLY,
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
    resolve: {
      alias: [
        {
          find: /^lucide-solid$/,
          replacement: resolve("node_modules/lucide-solid/dist/esm/lucide-solid.mjs"),
        },
      ],
    },
  }
});
