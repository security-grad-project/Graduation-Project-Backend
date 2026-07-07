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
ENV DATABASE_URL=postgresql://root@localhost:26257/defaultdb?sslmode=disable

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
