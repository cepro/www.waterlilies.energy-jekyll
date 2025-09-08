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
RUN bundle exec jekyll build --config _config.yml,_config_dev.yml

# Production stage - serve static files with nginx
FROM nginx:alpine

# Copy built site from builder stage
COPY --from=builder /app/_site /usr/share/nginx/html

# Expose port 8080 for Fly.io
EXPOSE 8080

# Configure nginx to listen on port 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

