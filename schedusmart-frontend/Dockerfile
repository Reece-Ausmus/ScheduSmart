FROM node:18-alpine

WORKDIR /usr/src/app

# install and cache app dependencies
COPY . /usr/src/app/
RUN rm -r /usr/src/app/node_modules

RUN npm install --force

EXPOSE 5173

CMD ["npm", "run", "dev"]