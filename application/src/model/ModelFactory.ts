import Debug from "debug";
import { Sequelize } from "sequelize";
const debug = Debug("service");

import { ProjectFactory } from "./Project.model";

export const ModelFactory = async (config: any) => {
  debug("Model Factory");
  debug(config);

  const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.DBHOST,
    dialect: config.DBDIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      encrypt: true,
    },
    logging: config.logging ? console.log : false,

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    // operatorsAliases: false
    // timezone: 'utc'
  });

  const Project = await ProjectFactory(sequelize, config);
  
  function close() {
    sequelize.close();
  }

  return {
    Project,
    close,
  };
};
