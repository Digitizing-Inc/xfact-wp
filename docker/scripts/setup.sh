#!/bin/sh
set -eu

# WordPress Auto-Setup Script
# Runs inside the wordpress:cli sidecar container after WordPress is healthy.
# Also runnable manually: make setup
#
# Note: --path is set in wp-cli.yml (mounted at /var/www/html).

: "${WORDPRESS_DB_NAME:?missing}"
: "${WORDPRESS_DB_USER:?missing}"
: "${WORDPRESS_DB_PASSWORD:?missing}"

SITE_URL="${WP_SITE_URL:-http://localhost:8080}"
SITE_TITLE="${WP_SITE_TITLE:-xFact | Technology Services}"
ADMIN_USER="${WP_ADMIN_USER:-admin}"
ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-admin}"
ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"
THEME_SLUG="${WP_THEME_SLUG:-xfact}"

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

if ! wp config path >/dev/null 2>&1; then
    echo "🧩 Creating wp-config.php..."

    wp config create \
        --dbname="$WORDPRESS_DB_NAME" \
        --dbuser="$WORDPRESS_DB_USER" \
        --dbpass="$WORDPRESS_DB_PASSWORD" \
        --dbhost="db:3306" \
        --allow-root \
        --skip-check
fi

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

# Activate the theme
echo "🎨 Activating theme: $THEME_SLUG..."
wp theme activate "$THEME_SLUG" 2>/dev/null ||
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

# Install and activate Akismet Anti-Spam plugin
echo "🛡️ Setting up Akismet Anti-Spam..."
if ! wp plugin is-installed akismet 2>/dev/null; then
    wp plugin install akismet --activate
else
    wp plugin activate akismet 2>/dev/null || true
fi
echo "✅ Akismet configured."

# Install and activate Safe SVG
echo "🖼️ Setting up Safe SVG..."
if ! wp plugin is-installed safe-svg 2>/dev/null; then
    wp plugin install safe-svg --activate
else
    wp plugin activate safe-svg 2>/dev/null || true
fi
echo "✅ Safe SVG configured."

# Install, activate, and configure Yoast SEO
echo "🔍 Setting up Yoast SEO..."
if ! wp plugin is-installed wordpress-seo 2>/dev/null; then
    wp plugin install wordpress-seo --activate
else
    wp plugin activate wordpress-seo 2>/dev/null || true
fi

# Configure Yoast SEO defaults
wp eval '
    $options = get_option("wpseo_titles", []);
    $options["title-home-wpseo"] = "%%sitename%% - %%sitedesc%%";
    $options["metadesc-home-wpseo"] = "Technology services that deliver results for public-sector organizations.";
    $options["company_name"] = "xFact";
    $options["company_or_person"] = "company";
    update_option("wpseo_titles", $options);
'
echo "✅ Yoast SEO configured."


# Set permalink structure
echo "🔗 Setting permalink structure..."
wp rewrite structure '/%postname%/' --hard
wp rewrite flush --hard

# Set timezone
wp option update timezone_string "${WP_TIMEZONE:-UTC}" 2>/dev/null || true

# Set site description (tagline) to match source site branding
wp option update blogdescription "Behind the Systems Communities Rely On" 2>/dev/null || true

# Delete default plugins (keeping Akismet as a reference)
wp plugin delete hello 2>/dev/null || true

# Seed page content
if [ -f "/usr/local/bin/wp-seed-content.sh" ]; then
    sh /usr/local/bin/wp-seed-content.sh
fi

# Seed SEO data
if [ -f "/usr/local/bin/wp-seed-seo.php" ]; then
    echo "📈 Populating Yoast SEO metadata..."
    wp eval-file /usr/local/bin/wp-seed-seo.php
fi

# Clean up any DB-stored template-part overrides so the theme files are used
echo "🧹 Clearing template-part overrides..."
for part_slug in header footer; do
    PART_ID=$(wp post list --post_type=wp_template_part --name="$part_slug" --field=ID 2>/dev/null || true)
    if [ -n "$PART_ID" ]; then
        wp post delete "$PART_ID" --force 2>/dev/null || true
        echo "  ✅ Cleared DB override for: $part_slug"
    fi
done

echo ""
echo "🚀 WordPress setup complete!"
echo "   Site URL: $SITE_URL"
echo "   Admin:    $SITE_URL/wp-admin/"
echo "   User:     $ADMIN_USER"
echo ""
