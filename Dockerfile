FROM node:24-alpine AS base
RUN apk add --no-cache tzdata bash
RUN addgroup --system --gid 4022 vitemail && adduser --system --uid 4022 vitemail
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /app
COPY --from=deps --chown=vitemail:vitemail /app/node_modules ./node_modules
COPY --chown=vitemail:vitemail ./dist ./dist
COPY --chown=vitemail:vitemail ./package.json ./package.json
COPY --chown=vitemail:vitemail ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN mkdir -p log && chown -R vitemail:vitemail log

USER vitemail
EXPOSE 3000

CMD ["node", "dist/main.js"]