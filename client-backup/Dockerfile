# Stage 1: Dependencies
FROM node:lts-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:lts-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9
COPY --from=deps /app/node_modules ./node_modules
COPY .env.tpl .
COPY . .

COPY --from=1password/op:2 /usr/local/bin/op /usr/local/bin/op

ENV COURSEFULL_ENV Prod
RUN --mount=type=secret,id=op_service_account_token \
    OP_SERVICE_ACCOUNT_TOKEN=$(cat /run/secrets/op_service_account_token) \
    op run --env-file=.env.tpl -- pnpm build

# Stage 3: Runner
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV APP_USER=nextjs

RUN addgroup -S $APP_USER \
    && adduser -S $APP_USER -G $APP_USER \
    && mkdir -p /app

COPY --from=1password/op:2 /usr/local/bin/op /usr/local/bin/op
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/docker-entrypoint.sh ./

RUN chown -R $APP_USER:$APP_USER /app

USER nextjs

EXPOSE 5100

ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
