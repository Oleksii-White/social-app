FROM node:19.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npm install -g prisma

RUN prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "start"]


