FROM mongo:latest

RUN apt-get update && apt-get install -y mongodb

COPY init.js /docker-entrypoint-initdb.d/

RUN mkdir app

WORKDIR /app

COPY .env .
COPY server.js .
COPY db.js .
COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3456