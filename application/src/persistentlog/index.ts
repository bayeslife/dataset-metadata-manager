import { IFileEvent } from "../types";
import { FILEEVENT_TYPE } from "../domain";


const DEMO_COUNT=100

let nextId = 0;
const id = (): string => {
  return "AB" + nextId++;
};


const DEMO_FILEEVENT : IFileEvent = {
  id: "FY2021",
  type: FILEEVENT_TYPE,  
  description: "Port FY2021",  
  createdBy: "Phil",
  createdAt: new Date(),  
}


export const Log = () => {
  const fileevents: IFileEvent[] = [];
  fileevents.push(DEMO_FILEEVENT)

  return [
    ...fileevents,      
  ];
};
