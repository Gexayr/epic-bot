FROM node:20-slim

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install -g pixverse

COPY . .

CMD ["node", "src/bot.js"]