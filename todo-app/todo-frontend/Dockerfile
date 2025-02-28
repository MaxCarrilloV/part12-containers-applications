FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY . .
ENV VITE_BACKEND_URL='http://localhost:3000/'
RUN npm ci
RUN npm run build
# Esta es una nueva etapa, todo lo anterior a esta linea ha desaparecido, excepto por los archivos que queremos COPIAR
FROM build-stage AS test
COPY . .
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
RUN npm test

FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html


