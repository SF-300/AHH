FROM node:14.1-alpine

WORKDIR /opt/web
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN PATH="./node_modules/.bin:$PATH" npm run build
