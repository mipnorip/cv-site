import type { Experience as ExperienceType } from '../types/index.js';
import experienceStyles from '../styles/experience.module.css';

export class Experience {
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  render(experiences: ExperienceType[]): void {
    const experiencesHTML = experiences.map(exp => this.renderExperience(exp)).join('');

    this.container.innerHTML = `
      <div class="${experienceStyles.container}">
        <h2 class="${experienceStyles.title}">Опыт работы</h2>
        <div class="${experienceStyles.timeline}">
          ${experiencesHTML}
        </div>
      </div>
    `;
  }

  private renderExperience(exp: ExperienceType): string {
    const period = this.formatPeriod(exp.period);
    const descriptionHTML = exp.description.map(desc => 
      `<li class="${experienceStyles.descriptionItem}">${desc}</li>`
    ).join('');
    
    const technologiesHTML = exp.technologies && exp.technologies.length > 0
      ? `<div class="${experienceStyles.technologies}">
           ${exp.technologies.map(tech => 
             `<span class="${experienceStyles.techTag}">${tech}</span>`
           ).join('')}
         </div>`
      : '';

    return `
      <div class="${experienceStyles.item}">
        <div class="${experienceStyles.content}">
          <div class="${experienceStyles.header}">
            <h3 class="${experienceStyles.company}">${exp.company}</h3>
            <span class="${experienceStyles.period}">${period}</span>
          </div>
          <p class="${experienceStyles.position}">${exp.position}</p>
          <ul class="${experienceStyles.description}">
            ${descriptionHTML}
          </ul>
          ${technologiesHTML}
        </div>
      </div>
    `;
  }

  private formatPeriod(period: { start: string; end: string | "present" }): string {
    const startDate = new Date(period.start + '-01');
    const startFormatted = startDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    
    if (period.end === 'present') {
      return `${startFormatted} — настоящее время`;
    }
    
    const endDate = new Date(period.end + '-01');
    const endFormatted = endDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    return `${startFormatted} — ${endFormatted}`;
  }
}

