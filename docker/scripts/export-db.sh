#!/usr/bin/env bash
set -e

# Load .env variables if they exist
if [ -f .env ]; then
  # Export variables from .env (ignoring comments)
  export $(grep -v '^#' .env | xargs)
fi

# Usage: ./docker/scripts/export-db.sh [target_domain]
# Defaults to WP_TARGET_DOMAIN from .env, or xfact2stg.wpenginepowered.com.
TARGET_DOMAIN="${1:-${WP_TARGET_DOMAIN:-xfact2stg.wpenginepowered.com}}"

# Extract local domain from WP_SITE_URL (e.g. http://localhost:8080 -> localhost:8080)
LOCAL_DOMAIN=$(echo "${WP_SITE_URL:-http://localhost:8080}" | awk -F/ '{print $3}')
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_FILE="${BACKUP_DIR}/db_${TIMESTAMP}.sql"
echo "=========================================="
echo " Creating WordPress Database Backup       "
echo "=========================================="
echo "Target Domain: $TARGET_DOMAIN"
echo "Local Domain:  $LOCAL_DOMAIN"
echo "Backup Dir:    $BACKUP_DIR"
echo "=========================================="

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "1) Exporting database and replacing URLs..."
# We replace http://localhost:8080 with https://TARGET_DOMAIN and export the result.
# The --export flag ensures the local database is NOT modified.
docker compose exec -T -u www-data wordpress wp search-replace "http://${LOCAL_DOMAIN}" "https://${TARGET_DOMAIN}" --export="/tmp/db_backup.sql" --quiet

# Copy the generated backup from the container to the host
docker compose cp wordpress:/tmp/db_backup.sql "$DB_FILE"
docker compose exec -T -u www-data wordpress rm /tmp/db_backup.sql
echo "   -> Saved to $DB_FILE"

echo "=========================================="
echo " Backup complete! "
echo " Database: $DB_FILE"
echo " You can now import this file into WP Engine."
echo "=========================================="
