# To copy & run our main React build-
FROM node:18
WORKDIR /

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
