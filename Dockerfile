FROM node:14.19.1

MAINTAINER liuzhaobing

ADD . /opt/smartest-vue/

WORKDIR /opt/smartest-vue/

RUN npm install -g npm@6.14.16

RUN npm install

RUN npm rebuild node-sass --force

ENV HOST 0.0.0.0

ENV PORT 27996

EXPOSE 27996

CMD ["npm", "run", "dev"]
