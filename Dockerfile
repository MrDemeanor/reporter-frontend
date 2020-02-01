FROM node:latest

EXPOSE 4200

ENV GITHUB_USER="MrDemeanor"
ENV GITHUB_FOLDER="reporter-frontend"

ENV PATH /app/node_modules/.bin:$PATH

RUN apt-get update \
    && apt-get install git -y \
    && git clone "https://github.com/${GITHUB_USER}/${GITHUB_FOLDER}.git" \
    && cd ${GITHUB_FOLDER} \
    && npm install \
    && npm install -g @angular/cli

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0"]