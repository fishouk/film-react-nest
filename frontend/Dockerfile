FROM node:18-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm install --no-save @rollup/rollup-linux-x64-gnu

COPY . .

ENV VITE_API_URL=/api/afisha
ENV VITE_CDN_URL=/content/afisha

RUN npm run build

FROM alpine:3.20

WORKDIR /app

COPY --from=build /app/dist ./dist

CMD ["sh", "-c", "cp -r /app/dist/. /frontend_dist/ && tail -f /dev/null"]
