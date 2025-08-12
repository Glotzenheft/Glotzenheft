#!/bin/sh
set -e

run_as_www() { su -s /bin/sh -c "$*" www-data; }

mkdir -p var
chown -R www-data:www-data var

KEY_DIR="config"
PRIV="$KEY_DIR/private.pem"
PUB="$KEY_DIR/public.pem"

if [ ! -f "$PRIV" ]; then
    echo "Creating jwt keys."
    [ -d "$KEY_DIR" ] || install -d -o www-data -g www-data "$KEY_DIR"
    run_as_www "openssl genrsa -out '$PRIV' 4096"
    run_as_www "openssl rsa -in '$PRIV' -pubout -out '$PUB'"
else
    echo "JWT keys already exists."
fi

rm -rf var/cache/* || true

: "${BOOTSTRAP_ON_START:=0}"

if [ "$BOOTSTRAP_ON_START" = "1" ]; then
    echo "Bootstrap enabled: waiting for DB & running migrations…"
    if [ -n "$DATABASE_URL" ]; then
        echo "Waiting for DB..."
        for _ in $(seq 1 30); do
            if run_as_www "php bin/console doctrine:query:sql 'SELECT 1'" >/dev/null 2>&1; then break; fi
            sleep 2
        done
        echo "Start db migration."
        run_as_www "php bin/console doctrine:database:create --if-not-exists" || true
        run_as_www "php bin/console doctrine:migrations:migrate --no-interaction"
    else
        echo "WARNING: DATABASE_URL not set – skipping migrations."
    fi

    if [ -n "$DATABASE_URL" ] && [ -n "$TMDB_TOKEN" ]; then
        echo "Checking DB connectivity for TMDB migration..."
        if run_as_www "php bin/console doctrine:query:sql 'SELECT 1'" >/dev/null 2>&1; then
            LOCK_FILE="var/.tmdb_genres.migrated"
            if [ ! -f "$LOCK_FILE" ]; then
                echo "Running TMDB genres migration..."
                if run_as_www "php bin/console glotzenheft:tmdb:migrateGenres --no-interaction --env=prod"; then
                    touch "$LOCK_FILE" && chown www-data:www-data "$LOCK_FILE" || true
                    echo "TMDB genres migration done."
                else
                    echo "WARNING: TMDB genres migration failed (startup continues)." >&2
                fi
            else
                echo "TMDB genres migration already done (lock: $LOCK_FILE)."
            fi
        else
            echo "WARNING: DB not reachable yet; skipping TMDB migration." >&2
        fi
    else
        echo "Skipping TMDB migration (DATABASE_URL or TMDB_TOKEN missing)."
    fi
else
    echo "Bootstrap disabled (BOOTSTRAP_ON_START=0) – skipping migrations/import."
fi

run_as_www "php bin/console cache:warmup" || true

exec "$@"
