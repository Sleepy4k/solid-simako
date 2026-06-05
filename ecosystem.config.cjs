/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "simakos",
      script: ".output/server/index.mjs",
      interpreter: "bun",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
    },
  ],
};
