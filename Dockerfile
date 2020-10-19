from node:14.4-alpine

WORKDIR /home/node/app
COPY ./dist /home/node/app
COPY ./node_modules /home/node/app/node_modules
#ENV NODE_ENV: production

EXPOSE 8000


ENTRYPOINT ["node","index.js"]
