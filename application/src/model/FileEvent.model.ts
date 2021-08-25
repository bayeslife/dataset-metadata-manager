import Debug from "debug";
import { DataTypes } from "sequelize";

const debug = Debug("ModelService");

export const FileEventFactory = async (sequelize: any, config: any) => {
  const FileEvent = sequelize.define(
    "FileEvents",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },      
      datasetType: {
        type: DataTypes.STRING,
        allowNull: false,
      },      
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      blobId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },   
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createAt:{
        type: DataTypes.DATE,
        allowNull: false,
      },   
    },
    {
      schema: config.schema,
      tableName: "FileEvents",
      timestamps: true,
    }
  );

  if (config.RESYNC === "true") {
    await FileEvent.sync({ force: config.force });
  }

  async function create(data: any) {    
    const create = await FileEvent.create(data);
    if (data.Categories) {
      await create.setCategories(data.Categories.map((c: any) => c.id));
      await create.save();
      return get(create.id);
    }
    return create;
  }
  async function upsert(data: any) {
    var filevent = await get(data.id);
    if (!filevent) return create(data);
    await filevent.update(data);
    
    await filevent.save();
    return filevent;
  }

  async function update(data: any) {
    debug(data);
    await FileEvent.build(data).save();
  }

  async function get(id = "") {
    const where = { id };
    return FileEvent.findOne({ where } );
  }

  async function queryCount(where = {}) {
    const result = await FileEvent.count({ where });
    return result;
  }

  async function query(where = {}) {
    debug("Query");
    debug(where);
    return FileEvent.findAll({ where,
      order: [['createdAt', 'DESC']]
     });
  }

  async function destroy(id = "") {
    try {
      return FileEvent.destroy({ 
        where: { id }         
      });
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  return {
    FileEvent,
    create,
    update,
    get,
    query,
    queryCount,
    destroy,
    upsert,
  };
};
