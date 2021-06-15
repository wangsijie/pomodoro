FROM node:lts
WORKDIR /usr/local/src
COPY package.json package.json
COPY yarn.lock yarn.lock
ARG JWT_KEY
ARG GH_ID
ARG GH_SK
ARG OTS_AK
ARG OTS_SK
ARG OTS_ENDPOINT
ARG OTS_INSTANCE
RUN yarn install
COPY . .
RUN yarn build
CMD [ "/bin/sh", "-c", "cd /usr/local/src && yarn start:prod" ]
