FROM node:lts
WORKDIR /usr/local/src
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY . .
RUN yarn build
CMD [ "/bin/sh", "-c", "cd /usr/local/src && yarn start:prod" ]
