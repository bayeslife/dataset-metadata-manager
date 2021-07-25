# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY ./application /home/site/application
COPY ./services /home/site/services

RUN cd /home/site/application && npm install && npm run test && npm run build
RUN cd /home/site/services && npm install && npm run build

RUN ln -s /home/site/services /home/site/wwwroot
