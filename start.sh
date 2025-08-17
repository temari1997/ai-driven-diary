#!/bin/sh

# Replace the placeholder with the PORT environment variable
envsubst < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;'
