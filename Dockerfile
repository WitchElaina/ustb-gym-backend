FROM mongo:latest

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get update && apt-get install -y nodejs build-essential

COPY init.js /docker-entrypoint-initdb.d/

RUN mkdir app

WORKDIR /app

COPY .env .
COPY server.js .
COPY dbgoose.js .
COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3456