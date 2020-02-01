FROM node:latest
WORKDIR /app
EXPOSE 4200
COPY . /app
ENV PATH=/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
RUN /bin/sh -c npm install     \
    && npm install -g @angular/cli
ENTRYPOINT ["ng" "serve" "--host" "0.0.0.0"]