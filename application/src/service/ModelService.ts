import Debug from "debug";
import { ICommandResult, IModel, IFileEvent } from "../types";
import { FILEEVENT_TYPE, COMMAND_STATUS } from "../domain";
const { v4: uuid } = require("uuid");

const debug = Debug("ModelService");

let seeded = false;

export const ModelService = async (model: IModel) => {
  const createFileEvent = async (FileEvent: IFileEvent): Promise<IFileEvent> => {
    const relationalModel = await model.FileEvent.create(FileEvent);
    return relationalModel;
  };

  const updateFileEvent = async (FileEvent: IFileEvent): Promise<IFileEvent> => {
    const relationalModel = await model.FileEvent.upsert(FileEvent);
    return relationalModel;
  };

  const queryFileEvents = async (where?: any) => {
    const relationalModel = await model.FileEvent.query(where);
    return relationalModel;
  };

  const getFileEvent = async (id: string) => {
    const relationalModel = await model.FileEvent.get(id);
    return relationalModel;
  };

  const deleteFileEvent = async (id: string): Promise<ICommandResult> => {
    try {
      const result: ICommandResult = {
        msg: "FileEvent Deleted",
        status: COMMAND_STATUS.OK,
      };
      await model.FileEvent.destroy(id);
      return result;
    } catch (e) {
      console.log(e);
      return { msg: e, status: COMMAND_STATUS.FAILED };
    }
  };

  const create = (specification: any) => {
    if (specification.type === FILEEVENT_TYPE) {
      return model.FileEvent.create(specification);
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
    FILEEVENT_TYPE,

    model,
    seed,
    queryFileEvents,
    createFileEvent,
    updateFileEvent,
    getFileEvent,
    deleteFileEvent,    
  };
};
