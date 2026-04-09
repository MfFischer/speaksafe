# Simple Production stage
FROM nginx:stable-alpine

# Copy the local build output to nginx
COPY ./build /usr/share/nginx/html

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
