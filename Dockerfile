# Базовый образ с Node.js
FROM node:18-slim

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

CMD ["node", "bot.js"]