import Debug from "debug";
import { DataTypes } from "sequelize";
const { v4: uuid } = require("uuid");

const debug = Debug("ModelService");

export const ProjectFactory = async (sequelize: any, config: any) => {
  const Project = sequelize.define(
    "Projects",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Active",
      },
      locked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      context: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lockedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      archivedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      schema: config.schema,
      tableName: "Projects",
      timestamps: true,
    }
  );

  if (config.RESYNC === "true") {
    await Project.sync({ force: config.force });
  }

  async function create(data: any) {
    if (!data.id) data.id = uuid();
    const create = await Project.create(data);
    if (data.Categories) {
      await create.setCategories(data.Categories.map((c: any) => c.id));
      await create.save();
      return get(create.id);
    }
    return create;
  }
  async function upsert(data: any) {
    var proj = await get(data.id);
    if (!proj) return create(data);
    await proj.update(data);
    
    await proj.save();
    return proj;
  }

  async function update(data: any) {
    debug(data);
    await Project.build(data).save();
  }

  async function get(id = "") {
    const where = { id };
    return Project.findOne({ where } );
  }

  async function queryCount(where = {}) {
    const result = await Project.count({ where });
    return result;
  }

  async function query(where = {}) {
    debug("Query");
    debug(where);
    return Project.findAll({ where });
  }

  async function destroy(id = "") {
    try {
      return Project.destroy({ where: { id } });
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  return {
    Project,
    create,
    update,
    get,
    query,
    queryCount,
    destroy,
    upsert,
  };
};
