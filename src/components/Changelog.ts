import type { ChangelogEntry } from '../types/index.js';
import changelogStyles from '../styles/changelog.module.css';

export class Changelog {
  private container: HTMLElement;
  private entries: ChangelogEntry[] = [];
  private expandedWeeks: Set<string> = new Set();

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  render(entries: ChangelogEntry[]): void {
    this.entries = entries.sort((a, b) => b.week.localeCompare(a.week));
    this.renderContent();
  }

  private renderContent(): void {
    const entriesHTML = this.entries.map(entry => this.renderEntry(entry)).join('');

    this.container.innerHTML = `
      <div class="${changelogStyles.container}">
        <h2 class="${changelogStyles.title}">Changelog</h2>
        <p class="${changelogStyles.subtitle}">Подробный отчет о задачах, решенных на каждой неделе</p>
        <div class="${changelogStyles.entries}">
          ${entriesHTML}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderEntry(entry: ChangelogEntry): string {
    const isExpanded = this.expandedWeeks.has(entry.week);
    const weekFormatted = this.formatWeek(entry.week);
    const tasksHTML = entry.tasks.map(task => this.renderTask(task)).join('');

    return `
      <div class="${changelogStyles.entry}">
        <button class="${changelogStyles.weekHeader} ${isExpanded ? changelogStyles.weekHeaderExpanded : ''}" data-week="${entry.week}">
          <span class="${changelogStyles.weekDate}">${weekFormatted}</span>
          <span class="${changelogStyles.weekTasksCount}">${entry.tasks.length} задач</span>
          <span class="${changelogStyles.weekToggle}">${isExpanded ? '▼' : '▶'}</span>
        </button>
        <div class="${changelogStyles.weekContent} ${isExpanded ? changelogStyles.weekContentExpanded : ''}">
          <div class="${changelogStyles.tasks}">
            ${tasksHTML}
          </div>
        </div>
      </div>
    `;
  }

  private renderTask(task: ChangelogEntry['tasks'][0]): string {
    const categoryHTML = task.category
      ? `<span class="${changelogStyles.taskCategory}">${task.category}</span>`
      : '';

    return `
      <div class="${changelogStyles.task}">
        <div class="${changelogStyles.taskHeader}">
          <h4 class="${changelogStyles.taskTitle}">${task.title}</h4>
          ${categoryHTML}
        </div>
        <p class="${changelogStyles.taskDescription}">${task.description}</p>
      </div>
    `;
  }

  private formatWeek(week: string): string {
    const date = new Date(week);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    
    const startFormatted = date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    const endFormatted = endDate.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    return `${startFormatted} — ${endFormatted}`;
  }

  private attachEventListeners(): void {
    const weekHeaders = this.container.querySelectorAll(`.${changelogStyles.weekHeader}`);
    weekHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const week = header.getAttribute('data-week');
        if (week) {
          if (this.expandedWeeks.has(week)) {
            this.expandedWeeks.delete(week);
          } else {
            this.expandedWeeks.add(week);
          }
          this.renderContent();
        }
      });
    });
  }
}

