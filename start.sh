#!/bin/sh

# Replace the '${PORT}' placeholder with the PORT environment variable
envsubst '${PORT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Output the generated config file for debugging
echo "--- Generated nginx.conf ---"
cat /etc/nginx/conf.d/default.conf
echo "--------------------------"

# Start Nginx
nginx -g 'daemon off;'
