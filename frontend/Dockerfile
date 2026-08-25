# Build the static bundle, then serve it from nginx. The build talks to the
# backend through the same origin, so nginx also proxies /api.
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# In the container image the app runs against the real backend, not the mock.
ENV VITE_USE_MOCK=false
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
