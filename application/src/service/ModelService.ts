import Debug from "debug";
import { ICommandResult, IModel, IProject } from "../types";
import { PROJECT_TYPE, CATEGORY_TYPE, COMMAND_STATUS } from "../domain";
const { v4: uuid } = require("uuid");

const debug = Debug("ModelService");

let seeded = false;

export const ModelService = async (model: IModel) => {
  const createProject = async (Project: IProject): Promise<IProject> => {
    const relationalModel = await model.Project.create(Project);
    return relationalModel;
  };

  const updateProject = async (Project: IProject): Promise<IProject> => {
    const relationalModel = await model.Project.upsert(Project);
    return relationalModel;
  };

  const queryProjects = async (where?: any) => {
    const relationalModel = await model.Project.query(where);
    return relationalModel;
  };

  const getProject = async (id: string) => {
    const relationalModel = await model.Project.get(id);
    return relationalModel;
  };

  const deleteProject = async (id: string): Promise<ICommandResult> => {
    try {
      const result: ICommandResult = {
        msg: "Project Deleted",
        status: COMMAND_STATUS.OK,
      };
      await model.Project.destroy(id);
      return result;
    } catch (e) {
      console.log(e);
      return { msg: e, status: COMMAND_STATUS.FAILED };
    }
  };

  const create = (specification: any) => {
    if (specification.type === PROJECT_TYPE) {
      return model.Project.create(specification);
    }
  };

  const seed = async (log: any) => {
    if (model && !seeded) {
      for (var i = 0; i < log.length; i++) {
        try {
          const created = await create(log[i]);
        } catch (ex) {
          console.log(ex);
        }
      }      
      seeded = true;
    }
  };

  
  return {
    PROJECT_TYPE,

    model,
    seed,
    queryProjects,
    createProject,
    updateProject,
    getProject,
    deleteProject,    
  };
};
