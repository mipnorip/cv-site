import type { PersonalData, Experience, Project, ChangelogEntry } from '../types/index.js';
import personalDataJson from '../data/personal.json';
import experienceJson from '../data/experience.json';
import projectsJson from '../data/projects.json';
import changelogJson from '../data/changelog.json';

export async function loadPersonalData(): Promise<PersonalData> {
  return personalDataJson as PersonalData;
}

export async function loadExperience(): Promise<Experience[]> {
  return experienceJson as Experience[];
}

export async function loadProjects(): Promise<Project[]> {
  return projectsJson as Project[];
}

export async function loadChangelog(): Promise<ChangelogEntry[]> {
  return changelogJson as ChangelogEntry[];
}

