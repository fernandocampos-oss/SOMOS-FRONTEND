FROM node:16-alpine AS builder

ARG BUILD
ARG BASE_HREF=/

# Aumentar memoria de Node para el build
ENV NODE_OPTIONS="--max_old_space_size=4096"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .

RUN if [ -z "$BUILD" ]; then \
        npm run build -- --base-href=${BASE_HREF}; \
    else \
        npm run build -- --configuration ${BUILD} --base-href=${BASE_HREF} --optimization=false --build-optimizer=false; \
    fi

FROM nginx:alpine as deploy

ARG DIST_PATH=dist

WORKDIR /usr/share/nginx/html

RUN rm -rf *
COPY --from=builder /app/${DIST_PATH} .
COPY default.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
