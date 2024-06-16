FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
ENV PORT=8080
CMD ["npm", "run", "start"]