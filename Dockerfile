# To copy & run our main React build-
FROM node:18
WORKDIR /

COPY . .

RUN npm ci

EXPOSE 9090

CMD ["npm", "run", "server"]
