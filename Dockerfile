# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4.0-appservice
FROM node:15-alpine

WORKDIR "/app"

COPY application/package*.json ./application/
COPY services/package*.json ./services/

RUN cd application && npm install
RUN cd services && npm install

COPY . .

RUN cd application npm run build && npm run test 
RUN cd services && npm run build

EXPOSE 8080

CMD /app/run.sh