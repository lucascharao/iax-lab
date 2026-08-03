#!/usr/bin/env bash
# Blog IA — roda no VPS (cron pontual em America/Sao_Paulo)
# 1) gera 1 notícia nova (nunca repetida)
# 2) rebuild da imagem e atualiza o serviço Swarm (site no ar)
#
# Uso:
#   SLOT=morning /root/iaxlab-site/scripts/blog-cron.sh
#   /root/iaxlab-site/scripts/blog-cron.sh evening

set -euo pipefail

SITE_DIR="${SITE_DIR:-/root/iaxlab-site}"
LOG_FILE="${LOG_FILE:-/var/log/iaxlab-blog.log}"
SLOT="${1:-${SLOT:-manual}}"
LOCK_FILE="/tmp/iaxlab-blog-cron.lock"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[$(date -Iseconds)] já em execução, saindo" | tee -a "$LOG_FILE"
  exit 0
fi

cd "$SITE_DIR"

if [[ -f "$SITE_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$SITE_DIR/.env"
  set +a
fi

if [[ -z "${XAI_API_KEY:-}" ]]; then
  echo "[$(date -Iseconds)] ERRO: XAI_API_KEY ausente em $SITE_DIR/.env" | tee -a "$LOG_FILE"
  exit 1
fi

export XAI_API_KEY
export SLOT
export XAI_MODEL="${XAI_MODEL:-grok-4.3}"
export XAI_IMAGE_MODEL="${XAI_IMAGE_MODEL:-grok-imagine-image}"

{
  echo "========"
  echo "[$(date -Iseconds)] START slot=$SLOT"
  /usr/bin/node scripts/publish-ai-news.mjs
  echo "[$(date -Iseconds)] rebuild image"
  /usr/bin/docker build -t iaxlab-site:latest "$SITE_DIR"
  echo "[$(date -Iseconds)] service update"
  /usr/bin/docker service update --force --image iaxlab-site:latest iaxlab_site
  echo "[$(date -Iseconds)] DONE"
} >>"$LOG_FILE" 2>&1
