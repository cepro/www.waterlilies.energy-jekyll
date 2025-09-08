# Build stage
FROM ruby:3.3.6-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    git \
    nodejs

# Set working directory
WORKDIR /app

# Copy Gemfiles
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs=4 --retry=3

# Copy the rest of the application
COPY . .

# Build the Jekyll site with dev config
ENV JEKYLL_ENV=development
RUN bundle exec jekyll build --config _config.yml,_config_dev.yml

# Debug: List the contents to verify build
RUN ls -la /app/_site/ && \
    echo "=== Checking for index.html ===" && \
    ls -la /app/_site/index.html || echo "No index.html found!"

# Production stage - serve static files with nginx
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built site from builder stage
COPY --from=builder /app/_site/ /usr/share/nginx/html/

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Create nginx config for port 8080
RUN echo 'server { \
    listen 8080; \
    listen [::]:8080; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files $uri $uri/ =404; \
    } \
    error_page 404 /404.html; \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 8080 for Fly.io
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

