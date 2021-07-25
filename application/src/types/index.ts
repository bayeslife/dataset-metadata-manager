export interface IModel {
  Project: any;
  close: any;
}

export interface ICommandResult {
  status: string
  msg: string
  entity?: any // eslint-disable-line 
}

export interface IProjectModel {
  create: any;
  update: any;
}

export interface IDataRow {
  id: string;
  name: string;
}

export interface IEntity extends IDataRow {
  type: string
}

export interface IDataLockable extends IEntity {
  locked: boolean
  lockedBy?: string
}
export interface IDataArchivable extends IEntity {
  archived: boolean
  archivedBy?: string
}

export type IProject = IDataLockable &
  IDataArchivable & {
  description: string;
  context: string;
  updatedBy: string;
  updatedAt: Date;
  createdBy: string;
  createdAt: Date;  
}
