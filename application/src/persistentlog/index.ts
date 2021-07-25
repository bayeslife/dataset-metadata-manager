import { IProject } from "../types";
import { PROJECT_TYPE, CATEGORY_TYPE } from "../domain";
import { SMOKE_DOMAIN } from "../domain";

const DEMO_COUNT=100

let nextId = 0;
const id = (): string => {
  return "AB" + nextId++;
};


const DEMO_PROJECT : IProject = {
  id: "FY2021",
  type: PROJECT_TYPE,
  name: "Port-FY2021",
  description: "Port FY2021",
  context: SMOKE_DOMAIN,
  updatedBy: "Phil",
  createdBy: "Phil",
  createdAt: new Date(),
  updatedAt: new Date(),
  locked: false,
  archived: true,
}


export const Log = () => {
  const projects: IProject[] = [];
  projects.push(DEMO_PROJECT)

  return [
    ...projects,      
  ];
};
