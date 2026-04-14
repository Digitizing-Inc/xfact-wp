#!/bin/sh
set -eu

# WordPress Auto-Setup Script
# Runs inside the wordpress:cli sidecar container after WordPress is healthy.
# Also runnable manually: make setup
#
# Note: --path is set in wp-cli.yml (mounted at /var/www/html).

SITE_URL="${WP_SITE_URL:-http://localhost:8080}"
SITE_TITLE="${WP_SITE_TITLE:-WordPress Template}"
ADMIN_USER="${WP_ADMIN_USER:-admin}"
ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-admin}"
ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"
THEME_SLUG="${WP_THEME_SLUG:-starter-theme}"

echo "🔧 WordPress Setup Script"
echo "========================="

# Wait for database
echo "⏳ Waiting for database connection..."
max_retries=30
count=0
until wp db check --quiet 2>/dev/null; do
    count=$((count + 1))
    if [ "$count" -ge "$max_retries" ]; then
        echo "❌ Database not ready after $max_retries attempts. Exiting."
        exit 1
    fi
    echo "  Attempt $count/$max_retries..."
    sleep 2
done
echo "✅ Database connected."

# Install WordPress if not already installed
if ! wp core is-installed 2>/dev/null; then
    echo "📦 Installing WordPress..."
    wp core install \
        --url="$SITE_URL" \
        --title="$SITE_TITLE" \
        --admin_user="$ADMIN_USER" \
        --admin_password="$ADMIN_PASSWORD" \
        --admin_email="$ADMIN_EMAIL" \
        --skip-email
    echo "✅ WordPress installed."
else
    echo "✅ WordPress already installed."
fi

# Activate the starter theme
echo "🎨 Activating theme: $THEME_SLUG..."
wp theme activate "$THEME_SLUG" 2>/dev/null || \
    echo "⚠️  Theme '$THEME_SLUG' not found. Using default."

# Install and activate Redis Object Cache plugin
echo "🔴 Setting up Redis Object Cache..."
if ! wp plugin is-installed redis-cache 2>/dev/null; then
    wp plugin install redis-cache --activate
else
    wp plugin activate redis-cache 2>/dev/null || true
fi
wp redis enable 2>/dev/null || true
echo "✅ Redis Object Cache configured."

# Set permalink structure
echo "🔗 Setting permalink structure..."
wp rewrite structure '/%postname%/' --hard
wp rewrite flush --hard

# Set timezone
wp option update timezone_string "${WP_TIMEZONE:-UTC}" 2>/dev/null || true

# Remove default content
echo "🧹 Cleaning up default content..."
wp post delete 1 --force 2>/dev/null || true  # Hello World
wp post delete 2 --force 2>/dev/null || true  # Sample Page
wp comment delete 1 --force 2>/dev/null || true  # Default comment

# Delete default plugins (keeping Akismet as a reference)
wp plugin delete hello 2>/dev/null || true

echo ""
echo "🚀 WordPress setup complete!"
echo "   Site URL: $SITE_URL"
echo "   Admin:    $SITE_URL/wp-admin/"
echo "   User:     $ADMIN_USER"
echo ""
