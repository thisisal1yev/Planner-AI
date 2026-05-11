FROM oven/bun:1-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=/api
ARG VITE_IMGBB_API_KEY
ARG VITE_IMGBB_UPLOAD_URL=https://api.imgbb.com/1/upload
ARG VITE_TG_BOT_TOKEN
ARG VITE_TG_CHAT_ID
ENV VITE_API_URL=$VITE_API_URL \
    VITE_IMGBB_API_KEY=$VITE_IMGBB_API_KEY \
    VITE_IMGBB_UPLOAD_URL=$VITE_IMGBB_UPLOAD_URL \
    VITE_TG_BOT_TOKEN=$VITE_TG_BOT_TOKEN \
    VITE_TG_CHAT_ID=$VITE_TG_CHAT_ID
COPY package*.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
