
const DOTENV = require('dotenv')
const DOTENV_CONFIG = process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : '.env'
console.log(`Sourcing configuration from ${DOTENV_CONFIG}`)
DOTENV.config({ path: DOTENV_CONFIG })

const storageAccount = {
  accountName: process.env.STORAGE_ACCOUNTNAME,
  accessKey: process.env.STORAGE_ACCESSKEY,
  bucket: process.env.STORAGE_BUCKET || 'datasets'
}

const inmemoryConfig = {
    storageAccount,
    database: {    
      DBDIALECT: 'sqlite',
      force: true,
      RESYNC: 'true',
      logging: false,
    },
    seed: false
  }
  
  const localConfig = {
    storageAccount,
    database: {    
      USER: "metadata",
      PASSWORD: 'METAdata22',
      DBHOST: 'localhost',
      DB: 'metadata',
      DBDIALECT: 'mssql',
      schema: 'metadata',
      force: true,
      RESYNC: 'true',
      logging: true,
    },
    seed: false
  }
  

  export const config = process.env.TEST_DB_LOCAL ? localConfig : inmemoryConfig