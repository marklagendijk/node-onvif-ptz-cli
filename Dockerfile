FROM node:18-alpine
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci --production
COPY . .
USER node
ENTRYPOINT [ "node", "."]
CMD [ "" ]
