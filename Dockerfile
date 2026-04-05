FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_ENDPOINT
ARG VITE_DEFAULT_MODEL
ARG VITE_API_KEY
ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT
ENV VITE_DEFAULT_MODEL=$VITE_DEFAULT_MODEL
ENV VITE_API_KEY=$VITE_API_KEY
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
