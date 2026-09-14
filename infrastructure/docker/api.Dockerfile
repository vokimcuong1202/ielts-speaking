FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter database generate && pnpm --filter api build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
CMD ["node", "apps/api/dist/main.js"]
