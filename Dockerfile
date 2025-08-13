FROM node:22-alpine AS frontend-builder
WORKDIR /app/Frontend

COPY Frontend/package*.json ./
RUN npm ci

COPY Frontend/ ./
RUN npm run build -- --configuration=production --output-path=./dist/public

FROM php:8.3-fpm AS backend
WORKDIR /app/Backend

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip openssl libicu-dev libzip-dev zlib1g-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j$(nproc) intl pdo_mysql zip gd opcache \
 && rm -rf /var/lib/apt/lists/*

ENV COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_NO_INTERACTION=1
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY Backend/composer.* ./
RUN composer install --no-interaction --no-dev --prefer-dist --no-scripts

COPY --chown=www-data:www-data Backend/ ./
RUN composer dump-autoload --optimize --classmap-authoritative

COPY --from=frontend-builder /app/Frontend/dist/public/ /app/Backend/public/

COPY --chown=root:root docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 9000
ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]