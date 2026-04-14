FROM wordpress:6.9-php8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    less \
    mariadb-client \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Redis PHP extension
RUN pecl install redis \
    && docker-php-ext-enable redis

# Install WP-CLI
RUN curl -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x /usr/local/bin/wp \
    && wp --allow-root --version

# Configure OPcache for production
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=0'; \
    echo 'opcache.save_comments=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Enable Apache mod_rewrite and mod_headers
RUN a2enmod rewrite headers expires

# Set recommended Apache config for WordPress
RUN { \
    echo '<Directory /var/www/html>'; \
    echo '    AllowOverride All'; \
    echo '    Require all granted'; \
    echo '</Directory>'; \
    } > /etc/apache2/conf-available/wordpress.conf \
    && a2enconf wordpress

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

# Use the default WordPress entrypoint, then run our custom setup
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
