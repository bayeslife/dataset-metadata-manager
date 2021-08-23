import Debug from "debug";
import { Log } from "../../application/src/persistentlog";
import { ModelService } from "../../application/src/service";
import { getModel } from "../../application/src/model";
import express from "express";
import passport from "passport";
import { createAzureFunctionHandler } from "azure-function-express";
import bodyparser from "body-parser";
import { config } from "../src/config";
import { authorizationStrategy } from "../src/auth";
import { IFileEvent } from "../../application/src/types";
import { COMMAND_STATUS } from "../../application/src/domain";
import { IFileService } from '../../application/src/types'
import { FileService } from "../../application/src/service/FileService";

const debug = Debug("ModelService");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
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

// app.get(
//   "/api/ModelService/project/:id",
//   passport.authenticate("oauth-bearer", { session: false }),
//   async (req, res) => {
//     try {
//       if (!modelService) await initializeModel();
//       const id = req.params.id;
//       let project = await modelService.getProject(id);
//       if (project) res.status(200).send(project);
//       else res.status(500);
//     } catch (ex) {
//       console.log(ex);
//       res.status(500).send({ error: ex });
//     }
//   }
// );

// app.get(
//   "/api/ModelService/projects",
//   passport.authenticate("oauth-bearer", { session: false }),
//   async (req, res) => {
//     if (!modelService) await initializeModel();

//     const where = {};
//     const context = req.headers["context"];
//     if (context) {
//       Object.assign(where, { context });
//     }

//     let projects = await modelService.queryProjects(where);

//     res.status(200).send(projects);
//   }
// );

app.post(
  "/api/ModelService/fileevents",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    try {
      if (!modelService) await initializeModel();

      var fileevent: IFileEvent = req.body;
      fileevent.createdBy = fileevent.createdBy || req.authInfo.name;      
        
      //fileevent = await modelService.createFileEvent(fileevent);
      
      res.status(200).send(fileevent);
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);

// app.delete(
//   "/api/ModelService/project/:id",
//   passport.authenticate("oauth-bearer", { session: false }),
//   async (req, res) => {
//     try {
//       if (!modelService) await initializeModel();
//       console.log(`DELETE project/${req.params.id}`);
//       const result = await modelService.deleteProject(req.params.id);
//       if (result.status === COMMAND_STATUS.OK)
//         res.status(200).send({ msg: result.msg, status: COMMAND_STATUS.OK });
//       else if (result.status === COMMAND_STATUS.FAILED)
//         res
//           .status(400)
//           .send({ msg: result.msg, status: COMMAND_STATUS.FAILED });
//       else if (result.status === COMMAND_STATUS.NOTFOUND)
//         res
//           .status(404)
//           .send({ msg: result.msg, status: COMMAND_STATUS.NOTFOUND });
//     } catch (ex) {
//       res
//         .status(500)
//         .send({ msg: ex.toString(), status: COMMAND_STATUS.FAILED });
//     }
//   }
// );

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
      await fileService.sendBlock(datasetType,encoded,name,sliceNumber,totalSlices)      
      res.status(200).send({});
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);

export default createAzureFunctionHandler(app);
