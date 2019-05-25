FROM node:11.15.0-alpine

RUN apk add --no-cache build-base python python-dev

COPY . /app

WORKDIR /app

RUN npm install

RUN NODE_ENV=production npm run bundle

CMD ["node", "."]