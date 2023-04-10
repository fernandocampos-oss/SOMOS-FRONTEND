FROM nginx:alpine

#outputPath: dist
ARG DIST_PATH

RUN rm -rf /usr/share/nginx/html/*

COPY default.conf /etc/nginx/conf.d/

COPY ${DIST_PATH} /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
