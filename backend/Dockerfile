FROM node:16

RUN apt update
RUN apt install -y netcat

WORKDIR /app
COPY package*.json ./
RUN npm install --save

COPY . .
RUN npm i -g nodemon sequelize sequelize-cli dotenv pg --save
RUN npm audit fix
EXPOSE 8000

COPY ./docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
