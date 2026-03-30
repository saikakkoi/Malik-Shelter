FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

COPY frontend/package*.json ./frontend/
RUN npm ci --prefix frontend

COPY . .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npx prisma generate
RUN npx tsc -p tsconfig.json
RUN npm run build --prefix frontend

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache nginx

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/frontend/dist ./frontend/dist

RUN mkdir -p /app/public/uploads /app/dist/public /app/data \
  && touch /app/data/dev.db \
  && ln -sf /app/public/uploads /app/dist/public/uploads \
  && ln -sf /app/data/dev.db /app/dev.db \
  && ln -sf /app/dev.db /app/dist/dev.db

RUN cat > /etc/nginx/http.d/default.conf <<'EOF'
server {
  listen 80;
  server_name _;

  root /app/frontend/dist;
  index index.html;
  client_max_body_size 10m;

  location = /api {
    return 301 /api/;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

EXPOSE 80

CMD ["sh", "-c", "npx prisma migrate deploy && nginx && exec node dist/src/index.js"]
