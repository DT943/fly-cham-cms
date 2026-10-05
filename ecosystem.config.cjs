// PM2 process config for the public site (new_fly_cham) on the VPS.
//   Start:   pm2 start ecosystem.config.cjs
//   Reload:  pm2 reload flycham-web
//   Logs:    pm2 logs flycham-web
//
// Serves the built dist/ with deploy/serve.mjs (static + SPA fallback) on port
// 4000, next to the CMS backend (flycham-cms on 3000). Deploys go through
// `update-flycham` (deploy/update-flycham.sh).
module.exports = {
  apps: [
    {
      name: "flycham-web",
      script: "deploy/serve.mjs",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "4000",
      },
    },
  ],
};
