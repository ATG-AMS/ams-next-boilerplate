# node:20-alpine 이미지를 기반으로 base 빌드 스테이지를 정의합니다.
FROM node:20-alpine AS base

# base 스테이지를 기반으로 deps 빌드 스테이지를 정의합니다.
FROM base AS deps
# libc6-compat 설치가 필요한 이유를 이해하기 위해 아래 URL 참고
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 패키지 매니저 파일들을 복사합니다.
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc ./
# 사용 가능한 패키지 매니저에 따라 의존성을 설치합니다.
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# base 스테이지를 기반으로 builder 빌드 스테이지를 정의합니다.
FROM base AS builder
ARG BUILD_ENV
ARG DATABASE_URL

WORKDIR /app

# 패키지 매니저 설치
RUN npm install -g pnpm

# deps 스테이지에서 설치한 node_modules를 복사합니다.
COPY --from=deps /app/node_modules ./node_modules
# 애플리케이션의 소스 코드를 복사합니다.
COPY . .

# 환경변수를 설정합니다.
ENV BUILD_ENV $BUILD_ENV
ENV NEXT_TELEMETRY_DISABLED 1

# 빌드 스크립트를 실행합니다.
RUN pnpm dlx prisma generate && pnpm build

# base 스테이지를 기반으로 runner 빌드 스테이지를 정의합니다.
FROM base AS runner
WORKDIR /app

# 환경변수를 설정합니다.
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV DATABASE_URL $DATABASE_URL

# nextjs 사용자와 그룹을 시스템 사용자로 추가합니다.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# builder 스테이지에서 생성된 public 디렉토리를 복사합니다.
COPY --from=builder /app/public ./public

# .next 디렉토리를 생성하고 소유권을 설정합니다.
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Next.js의 output file tracing 기능을 활용하여 자동으로 이미지 크기를 줄일 수 있습니다.
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma/
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-bootstrap-app.sh ./

# nextjs 사용자로 전환합니다.
USER nextjs

# 3000번 포트를 노출합니다.
EXPOSE 3000

# 환경변수를 설정합니다.
ENV PORT 3000
# 호스트 이름을 localhost로 설정합니다.
ENV HOSTNAME "0.0.0.0"

# next build로 생성된 server.js를 실행합니다.
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
