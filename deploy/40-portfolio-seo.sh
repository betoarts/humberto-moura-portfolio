#!/bin/sh
set -eu
# Arguments support validation in a temporary directory; Nginx invokes with none.
portfolio_templates="${1:-/opt/portfolio}"
portfolio_public="${2:-/usr/share/nginx/html}"
SITE_URL="${SITE_URL:-}"
SITE_URL="${SITE_URL%/}"
if [ -z "$SITE_URL" ]; then
    cp "$portfolio_templates/index.html" "$portfolio_public/index.html"
    printf 'User-agent: *\nAllow: /\nDisallow: /health\n' > "$portfolio_public/robots.txt"
    rm -f "$portfolio_public/sitemap.xml"
    printf '%s\n' 'SEO: configure SITE_URL with the public HTTPS domain to enable canonical, sitemap and sharing image.' >&2
    exit 0
fi
# Only a trusted deployment variable supplies the origin; never trust request headers.
if ! printf '%s\n' "$SITE_URL" | grep -Eq '^https://[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?(:[0-9]+)?$'; then
    printf '%s\n' 'SITE_URL must be an HTTPS origin without path, query, spaces or fragment.' >&2
    exit 1
fi
portfolio_head="$(mktemp)"
trap 'rm -f "$portfolio_head"' EXIT
sed "s|__SITE_URL__|$SITE_URL|g" "$portfolio_templates/seo-head.template.html" > "$portfolio_head"
awk -v seo="$portfolio_head" '/<!-- PRODUCTION_SEO -->/ {while ((getline line < seo) > 0) print line; close(seo); next} {print}' "$portfolio_templates/index.html" > "$portfolio_public/index.html"
sed "s|__SITE_URL__|$SITE_URL|g" "$portfolio_templates/sitemap.template.xml" > "$portfolio_public/sitemap.xml"
printf 'User-agent: *\nAllow: /\nDisallow: /health\nSitemap: %s/sitemap.xml\n' "$SITE_URL" > "$portfolio_public/robots.txt"
