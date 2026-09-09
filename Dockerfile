FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
COPY dist/index.html /opt/portfolio/index.html
COPY deploy/seo-head.template.html deploy/sitemap.template.xml /opt/portfolio/
COPY --chmod=755 deploy/40-portfolio-seo.sh /docker-entrypoint.d/40-portfolio-seo.sh
RUN gzip -k -9 /usr/share/nginx/html/assets/*.css /usr/share/nginx/html/assets/*.js
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
