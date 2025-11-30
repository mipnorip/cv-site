import type { Project } from '../types/index.js';
import projectStyles from '../styles/projects.module.css';

export class Projects {
  private container: HTMLElement;
  private projects: Project[] = [];
  private currentFilter: 'all' | 'hobby' | 'personal' = 'all';

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  render(projects: Project[]): void {
    this.projects = projects;
    this.renderContent();
  }

  private renderContent(): void {
    const filteredProjects = this.getFilteredProjects();
    const projectsHTML = filteredProjects.map(project => this.renderProject(project)).join('');

    this.container.innerHTML = `
      <div class="${projectStyles.container}">
        <h2 class="${projectStyles.title}">Проекты и увлечения</h2>
        <div class="${projectStyles.filters}">
          <button class="${projectStyles.filterButton} ${this.currentFilter === 'all' ? projectStyles.filterButtonActive : ''}" data-filter="all">
            Все
          </button>
          <button class="${projectStyles.filterButton} ${this.currentFilter === 'personal' ? projectStyles.filterButtonActive : ''}" data-filter="personal">
            Личные проекты
          </button>
          <button class="${projectStyles.filterButton} ${this.currentFilter === 'hobby' ? projectStyles.filterButtonActive : ''}" data-filter="hobby">
            Хобби
          </button>
        </div>
        <div class="${projectStyles.grid}">
          ${projectsHTML}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private getFilteredProjects(): Project[] {
    if (this.currentFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(project => project.type === this.currentFilter);
  }

  private renderProject(project: Project): string {
    const imageHTML = project.image
      ? `<img src="${project.image}" alt="${project.title}" class="${projectStyles.image}" />`
      : `<div class="${projectStyles.imagePlaceholder}">${project.title.charAt(0)}</div>`;

    const linkHTML = project.link
      ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="${projectStyles.link}">
           VIEW PROJECT →
         </a>`
      : '';

    const technologiesHTML = project.technologies.map(tech =>
      `<span class="${projectStyles.techTag}">${tech}</span>`
    ).join('');

    return `
      <div class="${projectStyles.card}">
        ${imageHTML}
        <div class="${projectStyles.content}">
          <h3 class="${projectStyles.cardTitle}">${project.title}</h3>
          <p class="${projectStyles.description}">${project.description}</p>
          <div class="${projectStyles.technologies}">
            ${technologiesHTML}
          </div>
          ${linkHTML}
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const filterButtons = this.container.querySelectorAll(`.${projectStyles.filterButton}`);
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter') as 'all' | 'hobby' | 'personal';
        this.currentFilter = filter;
        this.renderContent();
      });
    });
  }
}

