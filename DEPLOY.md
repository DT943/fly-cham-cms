# Deploying the public site (new_fly_cham) to the VPS

The site is a static Vite build. On the VPS it lives next to the CMS backend:

| App | Folder | PM2 name | Port | Deploy command |
| --- | --- | --- | --- | --- |
| CMS backend (other repo) | `/var/www/flycham-cms` | `flycham-cms` | 3000 | `update-cms` |
| Public site (this repo) | `/var/www/flycham-web` | `flycham-web` | 4000 | `update-flycham` |

[deploy/serve.mjs](deploy/serve.mjs) serves `dist/` (single-page-app fallback,
long cache for hashed `/assets`, gzip, `/healthz`). `VITE_*` settings are baked
in at build time from `.env.production` (created from
[.env.production.example](.env.production.example) when missing).

## Fresh or wiped VPS

One script in the CMS repo sets up both apps, HTTPS (Caddy for
`cms-flycham.alpatrose.com` → :4000 and `cms-api.cms-flycham.alpatrose.com` →
:3000) and the CI login key. As root on the VPS:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Digital2025-byte/library-love-cloned/main/deploy/bootstrap-vps.sh)
```

The *One-time setup* steps below are what it automates.

## Deploying

Pushing to `main` deploys automatically (see *CI/CD* below). By hand, on the VPS:

```bash
update-flycham              # latest origin/main
update-flycham <commit>     # a specific commit (roll back / forward)
FORCE=1 update-flycham      # rebuild the current commit
```

[deploy/update-flycham.sh](deploy/update-flycham.sh) fetches, checks out the
commit, runs `npm ci`, builds into `dist.next`, swaps it in as `dist` (keeping
`dist.prev`), reloads PM2 and checks the home page. The live site is not touched
until the build succeeds, and a failed health check puts the previous build
back.

## CI/CD

[.github/workflows/deploy.yml](.github/workflows/deploy.yml):

| Event | What runs |
| --- | --- |
| Pull request to `main` | build (nothing is deployed) |
| Push to `main` | build, then SSH to the VPS and run `update-flycham <sha>` |
| Actions → **Site CI/CD** → *Run workflow* | same as a push (manual redeploy) |

## One-time setup

**A. Give the server read access.** The repository is private, so the VPS
pulls with a read-only *deploy key* (on the VPS, as root):

```bash
ssh-keygen -t ed25519 -N "" -C "flycham-web server" -f ~/.ssh/flycham_web_repo
printf 'Host github-flycham-web\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/flycham_web_repo\n  IdentitiesOnly yes\n' >> ~/.ssh/config
cat ~/.ssh/flycham_web_repo.pub
```

Add the printed key in GitHub → this repo → **Settings → Deploy keys → Add
deploy key** (leave *Allow write access* off).

**B. Clone, install the command and start the site:**

```bash
git clone git@github-flycham-web:Digital2025-byte/fly-cham-cms.git /var/www/flycham-web
printf '#!/bin/sh\nexec bash /var/www/flycham-web/deploy/update-flycham.sh "$@"\n' > /usr/local/bin/update-flycham
chmod +x /usr/local/bin/update-flycham
FORCE=1 update-flycham
curl -s http://127.0.0.1:4000/healthz        # → ok
```

**C. Let GitHub Actions log in to the VPS.** Add these secrets in this repo
(**Settings → Secrets and variables → Actions**). You can reuse the same key
pair you created for the CMS pipeline:

| Secret | Value |
| --- | --- |
| `VPS_SSH_HOST` | `191.215.44.115` |
| `VPS_SSH_USER` | `root` (the user that owns pm2) |
| `VPS_SSH_KEY` | the private key |
| `VPS_SSH_KNOWN_HOSTS` | output of `ssh-keyscan -t ed25519 191.215.44.115` |
| `VPS_SSH_PORT` | optional, only if SSH is not on port 22 |

**D. Put a domain in front (optional).** The site answers on
`http://191.215.44.115:4000`. To serve it on a domain with HTTPS, route the
domain to port 4000 in the VPS's reverse proxy (traefik) the same way
`cms-api.cms-flycham.alpatrose.com` is routed to port 3000, then point the
domain's DNS A record at `191.215.44.115`.
