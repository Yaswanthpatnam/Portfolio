/**
 * Projects Data Source
 * 
 * Projects are maintained in `projects.json` for easy editing,
 * programmatic additions (via `npm run add-project`), or the in-app modal!
 */
import projectsData from "./projects.json";

export const projects = projectsData;

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend & APIs" },
];
