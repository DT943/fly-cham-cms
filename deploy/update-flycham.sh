#!/usr/bin/env bash
# update-flycham — deploy the public site (new_fly_cham) on the VPS.
#
#   update-flycham            deploy the latest origin/main
#   update-flycham <sha>      deploy that exact commit (what GitHub Actions does)
#   FORCE=1 update-flycham    rebuild even when already on the target commit
#
# Steps: fetch → checkout the target commit → npm ci → build into dist.next →
# swap it in as dist (the old one is kept as dist.prev) → pm2 reload → health
# check. The live dist/ is untouched until the build has succeeded, and a
# failed health check swaps the previous build back.
#
# Installed once as /usr/local/bin/update-flycham (see DEPLOY.md). Override
# defaults with APP_DIR / BRANCH / PM2_APP / HEALTH_URL.
#
# Everything runs inside main(): bash reads a script lazily, and `git reset`
# below rewrites this very file — parsing the whole function first keeps the
# running deploy unaffected by its own update.

main() {
  set -Eeuo pipefail

  local app_dir="${APP_DIR:-/var/www/flycham-web}"
  local branch="${BRANCH:-main}"
  local pm2_app="${PM2_APP:-flycham-web}"
  local health_url="${HEALTH_URL:-http://127.0.0.1:4000/}"
  local target="${1:-}"

  log() { printf '[update-flycham %s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
  fail() { log "ERROR: $*"; exit 1; }

  # One deploy at a time (a second push waits up to 10 minutes).
  exec 9>/tmp/update-flycham.lock
  flock -w 600 9 || fail "another deploy is still running"

  cd "$app_dir" || fail "$app_dir does not exist"
  git rev-parse --git-dir >/dev/null 2>&1 || fail "$app_dir is not a git clone (see DEPLOY.md)"

  log "fetching origin/$branch"
  git fetch --prune origin "$branch"
  target="$(git rev-parse --verify "${target:-origin/$branch}^{commit}")" \
    || fail "unknown commit: ${1:-origin/$branch}"

  local previous
  previous="$(git rev-parse HEAD)"
  if [[ "$previous" == "$target" && -f dist/index.html && "${FORCE:-0}" != 1 ]]; then
    log "already on ${target:0:7} — nothing to deploy (FORCE=1 to rebuild)"
    return 0
  fi
  log "deploying ${previous:0:7} → ${target:0:7}"

  # This folder is deploy-only: local edits are discarded (.env.production is
  # git-ignored, so it survives).
  git reset --hard "$target"
  [[ -f .env.production ]] || cp .env.production.example .env.production

  rollback_code() {
    log "rolling back to ${previous:0:7}"
    git reset --hard "$previous"
  }

  log "installing dependencies"
  if ! npm ci --no-audit --no-fund; then
    rollback_code
    fail "npm ci failed — the live site was not touched"
  fi

  log "building"
  rm -rf dist.next
  if ! npx vite build --outDir dist.next --emptyOutDir; then
    rm -rf dist.next
    rollback_code
    fail "build failed — the live site was not touched"
  fi

  # Swap: two renames, so the site is never without a complete build.
  rm -rf dist.prev
  [[ -d dist ]] && mv dist dist.prev
  mv dist.next dist

  log "reloading pm2 app $pm2_app"
  pm2 startOrReload ecosystem.config.cjs --update-env

  if ! wait_healthy "$health_url"; then
    rollback_code
    if [[ -d dist.prev ]]; then
      rm -rf dist
      mv dist.prev dist
    fi
    pm2 startOrReload ecosystem.config.cjs --update-env || true
    fail "health check failed on ${target:0:7} — previous release restored"
  fi

  pm2 save >/dev/null
  log "deployed ${target:0:7}: $(git log -1 --format='%s')"
}

# Healthy = the home page answers 200 and is the app's HTML (an empty or
# broken build fails this).
wait_healthy() {
  local url="$1" body
  for _ in $(seq 1 15); do
    body="$(curl -fsS -m 5 "$url" 2>/dev/null || true)"
    if [[ "$body" == *'id="root"'* ]]; then
      printf '[update-flycham] health check OK\n'
      return 0
    fi
    sleep 2
  done
  printf '[update-flycham] health check failed (%s did not return the app)\n' "$url"
  return 1
}

main "$@"
exit $?
