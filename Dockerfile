FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

FROM base AS development

ENV NODE_ENV=development

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM base AS build

ENV NODE_ENV=development
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/graduation_backend?schema=public

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM base AS production

ENV NODE_ENV=production

RUN mkdir -p logs && chown -R node:node /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY prisma.config.ts ./
COPY src/docs ./src/docs
COPY prisma ./prisma

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
