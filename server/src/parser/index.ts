import path from "node:path";
import * as loader from "./loader";
import * as parser from "./parser";
import * as templates from "./template";
import type { Project, SystemTemplateN, SystemTypeN, Template } from "./template";
export type { SystemTypeN as SystemType, Template } from "./template";

/**
 *
 * @param packagePath Absolute path to package
 *
 * @returns Templates
 */
export function loadPackage(packagePath: string): SystemTemplateN[] {
  //
  const parsedPath = path.parse(packagePath);
  parser.setPathPrefix(parsedPath.dir);
  parser.loadPackage(parsedPath.name);

  return templates.getTemplates().map((t) => t.getSystemTemplate());
}

export function getTemplates(): SystemTemplateN[] {
  return templates.getTemplates().map((t) => t.getSystemTemplate());
}

export function getSystemTypes(): SystemTypeN[] {
  return templates.getSystemTypes();
}

export function getOptions() {
  return templates.getOptions();
}

export function getAllTemplates(): Template[] {
  return templates.getTemplates();
}

export function getProject(): Project {
  return templates.getProject();
}
