const DOTENV = require('dotenv')
const DOTENV_CONFIG = process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : '.env'
console.log(`Sourcing configuration from ${DOTENV_CONFIG}`)
DOTENV.config({ path: DOTENV_CONFIG })

import bodyparser from "body-parser";
import cors from 'cors';
import Debug from "debug";
import express from "express";
import passport from "passport";
import { COMMAND_STATUS } from "../../../application/src/domain";
import { getModel } from "../../../application/src/model";
import { Log } from "../../../application/src/persistentlog";
import { ModelService } from "../../../application/src/service";
import { FileService } from "../../../application/src/service/FileService";
import { IFileService, IMetaData } from '../../../application/src/types';
import { authorizationStrategy } from "../../src/auth";
import { config } from "../../src/config";

const debug = Debug("ModelService");

const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.text());
app.use(passport.initialize());
passport.use(authorizationStrategy(config));
let modelService = null;
const initializeModel = async () => {
  const model = await getModel(config);
  modelService = await ModelService(model);
  const log = Log();
  if (config.seed) await modelService.seed(log);
};

let fileService : IFileService = null;
const initializeFileService = async () => {
  if(!fileService)
    fileService = await FileService(config.storageAccount)
};
initializeFileService();

app.get(
  "/api/ConfigService",  
  async (req, res) => {
    res.status(200).send({
      style: {
        endpoint: config.style.endpoint,
      },
      authentication: {
        clientId: config.authentication.clientId,
        tenantId: config.authentication.tenantId,
        scopes: config.authentication.scopes,
        redirectUri: config.authentication.redirectUri,
      }
    });
  }
);

app.get(
  "/api/ModelService/:dataset/:reference/files/:filename",
  //passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    if (!modelService) await initializeModel();

    let dataset = req.params.dataset
    let reference = req.params.reference

    const content = await fileService.download(dataset,reference)      
      if(content){
        res.setHeader('Content-Length', content.length)
        res.setHeader('Content-Type', 'text/csv')         
        res.status(200).send(content)
    } else {
        debug(`blob ${dataset} ${reference} doesnt exist`)
        res.sendStatus(404)
    }
  })


app.get(
    "/api/ModelService/fileevents",
    passport.authenticate("oauth-bearer", { session: false }),
    async (req, res) => {
      if (!modelService) await initializeModel();
      let content = await modelService.queryFileEvents({})
      if(content && !Array.isArray(content)){
        content = [content]
      }
      res.status(200).send({
        status: COMMAND_STATUS.OK,entity: content,msg: "success"
      })
    })

app.post(
  "/api/ModelService/fileevents",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    try {      
      if (!modelService) await initializeModel();

      const metadata: IMetaData = req.body;

      debug(`Creating new file event`)
      debug(metadata)
                  
      //await eventService.produce([metadata]);
      await modelService.createFileEvent({...metadata, createAt: Date.now()})                  
      res.status(200).send(metadata);
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);

app.post(
  "/api/ModelService/file",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {

    function fromBinary(encoded) {
      let binary = atob(encoded)
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return String.fromCharCode(...new Uint16Array(bytes.buffer));
    }

    try {
      if (!fileService) await initializeFileService();
      
      const {fileData,name,sliceNumber,totalSlices,datasetType} = req.body      
      const encoded = fileData.slice("data:application/octet-stream;base64,".length,fileData.length)      

      const meta = {...req.body}
      delete meta.fileData
      delete meta.sliceNumber
      delete meta.totalSlices
      delete meta.blobId
      delete meta.name
      await fileService.sendBlock(datasetType,encoded,name,sliceNumber,totalSlices,meta)            
      res.status(200).send({});
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);



app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`)
})
