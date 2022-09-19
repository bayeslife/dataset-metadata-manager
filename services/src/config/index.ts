import Debug from 'debug'
const DOTENV = require('dotenv')
const DOTENV_CONFIG = process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : '.env'
console.log(`Sourcing configuration from ${DOTENV_CONFIG}`)
DOTENV.config({ path: DOTENV_CONFIG })

console.log(`Debugging with ${process.env.DEBUG}`)

const debug = Debug('configuration')

const LOCAL = process.env.NODE_ENV !== 'production'
const SERVER_PORT = process.env.PORT || 3001

const inMemoryDB = {
  USER: "notapplicable",
  PASSWORD: 'notapplicable',
  DBHOST: 'localhost',
  DB: 'notapplicable',
  DBDIALECT: 'sqlite',
  schema: 'project',
  force: true,
  RESYNC: 'true',
  logging: true,
}

const localDB = {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DBHOST: process.env.DB_SERVER,
    DB: process.env.DB_DATABASE,
    DBDIALECT: 'mssql',
    schema: 'dataset',
    force: true,
    RESYNC: process.env.RESYNC, //set to true to populate schema
    logging: true,  
}

const database = process.env.DB === 'memory' ? inMemoryDB : localDB

const APP_URL = process.env.APP_URL
const STORAGE_DIRECTORY = '/tmp/'

//Here is the app registration https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/ab8c7f24-a30e-4ef4-bf82-713d248f96f9/isMSAApp/

export const config =  {
  LOCAL,
  port: process.env.PORT || 8080,  
  STORAGE_DIRECTORY,
  APP_URL,
  database,
  seed: process.env.SEED === 'true', //Seed the database
  
  testMode: false, // use this to turn off authentication    
  storageAccount: {
    connectionString: process.env.FILESTORAGE_CONNECTION_STRING,    
  },
  style: {
    endpoint: process.env.STYLE_ENDPOINT || 'https://localhost:3011'
  },
  authentication: {
    audience: process.env.AUTH_AUDIENCE || 'https://analysis.windows.net/powerbi/api',

    clientId: process.env.AUTH_CLIENTID || 'ab8c7f24-a30e-4ef4-bf82-713d248f96f9',
    tenantId: process.env.AUTH_TENANTID || '951b1ed2-d31c-4c2a-9dd6-8ea6137ceb9d',
    scopes: process.env.AUTH_SCOPES
      ? process.env.AUTH_SCOPES.split(',')
      : ['https://analysis.windows.net/powerbi/api/.default'],
    redirectUri: process.env.AUTH_REDIRECTURI || 'https://localhost:3005',
  }
}

debug(config)
