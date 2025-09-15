FROM node:22.19-alpine AS base
WORKDIR /usr/case-ten-todo

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM deps AS build
COPY . .
ENV NODE_ENV=production
ENV HOST=0.0.0.0
RUN npm run build

FROM base AS final

COPY --from=build /usr/app/.output .output
COPY --from=build /usr/app/node_modules .
COPY --from=build /usr/app/package*.json .

EXPOSE 3000
ENTRYPOINT ["sh", "-c", "cp -f /usr/app/package.json /usr/app-info || echo \"Aviso: não foi possível copiar package.json\" >&2; exec \"$@\"", "--"]
CMD ["runsvdir", "-P", "/etc/service"]
