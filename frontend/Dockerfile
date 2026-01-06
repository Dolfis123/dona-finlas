# Tahap 1: Build
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Terima variabel dari docker-compose
ARG VITE_API_BASE_URL
ARG VITE_BACKEND_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# Tahap 2: Serve Nginx
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]