FROM wordpress:cli-php8.3

# Install Redis PHP extension to match the main WordPress container.
# Required because WP-CLI bootstraps WordPress, which loads the
# Redis Object Cache drop-in (object-cache.php).
USER root
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps
USER www-data
