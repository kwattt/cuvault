# Step 1: Build the application
FROM node:18-alpine3.16 AS builder
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn install  --immutable --immutable-cache --check-cache

COPY . .
RUN yarn build

# Step 2: Set up the production environment
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
ENV VITE_API_URL=

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]