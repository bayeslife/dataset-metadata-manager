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
import { IProject } from "../../application/src/types";
import { COMMAND_STATUS } from "../../application/src/domain";

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
initializeModel();

app.get(
  "/api/ModelService/project/:id",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    try {
      if (!modelService) await initializeModel();
      const id = req.params.id;
      let project = await modelService.getProject(id);
      if (project) res.status(200).send(project);
      else res.status(500);
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);

app.get(
  "/api/ModelService/projects",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    if (!modelService) await initializeModel();

    const where = {};
    const context = req.headers["context"];
    if (context) {
      Object.assign(where, { context });
    }

    let projects = await modelService.queryProjects(where);

    res.status(200).send(projects);
  }
);

app.post(
  "/api/ModelService/projects",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    try {
      if (!modelService) await initializeModel();

      var project: IProject = req.body;
      project.createdBy = project.createdBy || req.authInfo.name;
      project.updatedBy = req.authInfo.name;
      project.updatedAt = new Date();

      if (project.id) {
        const prev = await modelService.getProject(project.id);
        if (prev.locked !== project.locked)
          project.lockedBy = req.authInfo.name;
        if (prev.archived !== project.archived)
          project.archivedBy = req.authInfo.name;

        project = await modelService.updateProject(project);
      } else {
        if (project.locked) project.lockedBy = req.authInfo.name;
        if (project.archived) project.archivedBy = req.authInfo.name;
        project = await modelService.createProject(project);
      }

      res.status(200).send(project);
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);

app.get(
  "/api/ModelService/categories",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    try {
      if (!modelService) await initializeModel();
      let categories = await modelService.queryCategories();

      res.status(200).send(categories);
    } catch (ex) {
      console.log(ex);
      res.status(500).send({ error: ex });
    }
  }
);


app.delete(
  "/api/ModelService/project/:id",
  passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    try {
      if (!modelService) await initializeModel();
      console.log(`DELETE project/${req.params.id}`);
      const result = await modelService.deleteProject(req.params.id);
      if (result.status === COMMAND_STATUS.OK)
        res.status(200).send({ msg: result.msg, status: COMMAND_STATUS.OK });
      else if (result.status === COMMAND_STATUS.FAILED)
        res
          .status(400)
          .send({ msg: result.msg, status: COMMAND_STATUS.FAILED });
      else if (result.status === COMMAND_STATUS.NOTFOUND)
        res
          .status(404)
          .send({ msg: result.msg, status: COMMAND_STATUS.NOTFOUND });
    } catch (ex) {
      res
        .status(500)
        .send({ msg: ex.toString(), status: COMMAND_STATUS.FAILED });
    }
  }
);

export default createAzureFunctionHandler(app);
