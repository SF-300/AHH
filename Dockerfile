FROM node:14.9-alpine as builder
WORKDIR /opt/web
COPY . ./
RUN npm ci && npm run build && npm prune --production && npm dedupe --production

FROM alpine as production
ENV NODE_ENV=production
# FIXME(zeronineseven): Freeze Node version!
RUN apk add --no-cache --update nodejs
WORKDIR /opt/web
COPY --from=builder /opt/web/node_modules ./node_modules
COPY --from=builder /opt/web/dist ./dist
ENV IFACE=0.0.0.0
ENTRYPOINT ["node", "dist/server.js"]
