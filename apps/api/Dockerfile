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
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy ALL tsconfig files for path resolution
COPY --from=builder /app/apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY --from=builder /app/apps/api/tsconfig.build.json ./apps/api/tsconfig.build.json

COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/

ENV NODE_ENV=production
ENV PORT=3000
# Set TS_NODE_PROJECT to point to tsconfig
ENV TS_NODE_PROJECT=/app/apps/api/tsconfig.json

EXPOSE 3000

WORKDIR /app/apps/api
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]