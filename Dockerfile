FROM node:21.6.1-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent

COPY . .

RUN npx prisma generate

RUN chown -R node /usr/src/app
USER node

EXPOSE 5000

CMD ["npm", "start"]
