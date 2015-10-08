FROM adexchangegrp/node:latest

ENV NODE_ENV prod

COPY . /src

RUN cd /src && npm install