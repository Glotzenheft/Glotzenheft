#!/bin/sh
set -e
CERT_DIR=/etc/nginx/certs
mkdir -p "$CERT_DIR"
if [ ! -f "$CERT_DIR/localhost-cert.pem" ] || [ ! -f "$CERT_DIR/localhost-key.pem" ]; then
    echo "Creating certs!";
    apk add --no-cache openssl >/dev/null
    openssl req -x509 -nodes -newkey rsa:2048 \
        -keyout "$CERT_DIR/localhost-key.pem" \
        -out   "$CERT_DIR/localhost-cert.pem" \
        -subj  "/CN=localhost" \
        -days  365
fi
exec nginx -g "daemon off;"
