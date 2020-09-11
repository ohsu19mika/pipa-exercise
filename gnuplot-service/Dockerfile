FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN apt update
RUN apt install -y gnuplot

EXPOSE 80

CMD ["npm", "start"]