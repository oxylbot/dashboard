FROM node:14.10.1-alpine

RUN apk add --no-cache build-base python python-dev

COPY . /app

WORKDIR /app

RUN npm install

RUN NODE_ENV=development npm run bundle

RUN npm prune --production

CMD ["node", "."]