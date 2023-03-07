FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev"]
# CMD [ "npm", "run", "start:prod"]