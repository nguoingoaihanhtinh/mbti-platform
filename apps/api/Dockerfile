# apps/api/Dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages

RUN bun install

WORKDIR /app/apps/api
RUN bun install

WORKDIR /app
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/
COPY tsconfig*.json ./

WORKDIR /app/apps/api
RUN bun run build

# Production
FROM node:20-alpine
WORKDIR /app/apps/api

RUN apk add --no-cache curl

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/src ./src
COPY --from=builder /app/apps/api/tsconfig*.json ./
COPY --from=builder /app/apps/api/package.json ./

RUN npm install

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]