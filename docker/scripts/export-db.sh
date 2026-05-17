#!/usr/bin/env bash
set -e

# Load .env variables if they exist
if [ -f .env ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    if [[ -z "$line" || "$line" == \#* ]]; then continue; fi
    export "$line"
  done < .env
fi

# Usage: ./docker/scripts/export-db.sh [target_domain]
# Defaults to WP_TARGET_DOMAIN from .env, or xfact2stg.wpenginepowered.com.
TARGET_DOMAIN="${1:-${WP_TARGET_DOMAIN:-xfact2stg.wpenginepowered.com}}"

# Extract local domain from WP_SITE_URL (e.g. http://localhost:8080 -> localhost:8080)
LOCAL_DOMAIN=$(echo "${WP_SITE_URL:-http://localhost:8080}" | awk -F/ '{print $3}')
BACKUP_DIR="backups"
DB_FILE="${BACKUP_DIR}/db_backup.sql"
echo "=========================================="
echo " Creating WordPress Database Backup       "
echo "=========================================="
echo "Target Domain: $TARGET_DOMAIN"
echo "Local Domain:  $LOCAL_DOMAIN"
echo "Backup Dir:    $BACKUP_DIR"
echo "=========================================="

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "1) Cleaning up local database clutter before export..."
docker compose exec -T -u www-data wordpress bash -c '
    wp db query "DELETE FROM wp_posts WHERE post_type IN (\"flamingo_inbound\", \"flamingo_contact\", \"revision\");" --quiet
    wp db query "DELETE FROM wp_posts WHERE post_status IN (\"auto-draft\", \"trash\");" --quiet
    wp db query "DELETE FROM wp_postmeta WHERE meta_key IN (\"_edit_lock\", \"_edit_last\", \"_wp_trash_meta_status\", \"_wp_trash_meta_time\", \"_wp_desired_post_slug\");" --quiet
    wp db query "DELETE FROM wp_options WHERE option_name LIKE \"_transient_%\" OR option_name LIKE \"_site_transient_%\";" --quiet
    wp db query "DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT ID FROM wp_posts);" --quiet
'

echo "2) Exporting database and replacing URLs..."
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
