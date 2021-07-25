import { ModelFactory } from "./ModelFactory";
import Debug from "debug";

const debug = Debug("model");

let model: any = null;

export const getModel = async (config: any) => {
  if (!model) {
    model = {};
    debug("Building ModelFactory");
    model = await ModelFactory(config.database);
  }
  return model;
};

export * from "./ModelFactory";
