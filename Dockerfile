# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN NITRO_PRESET=node-server pnpm build && test -d /app/.output

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV PORT=8080

RUN addgroup -S nodejs && adduser -S nuxt -G nodejs

COPY --from=build /app/.output ./.output

USER nuxt
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
