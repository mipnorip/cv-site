import type { ChangelogEntry } from '../types/index.js';
import changelogStyles from '../styles/changelog.module.css';

interface MonthTask {
  task: ChangelogEntry['tasks'][0];
  weekLabel: string;
  order: number;
}

interface MonthGroup {
  key: string;
  label: string;
  totalTasks: number;
  tasks: MonthTask[];
}

export class Changelog {
  private container: HTMLElement;
  private entries: ChangelogEntry[] = [];
  private expandedMonths: Set<string> = new Set();

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
    const months = this.groupByMonth(this.entries);
    const entriesHTML = months.map(month => this.renderMonth(month)).join('');

    this.container.innerHTML = `
      <div class="${changelogStyles.container}" data-animate="fade">
        <h2 class="${changelogStyles.title}">Changelog</h2>
        <p class="${changelogStyles.subtitle}">Подробный отчет по месяцам</p>
        <div class="${changelogStyles.entries}">
          ${entriesHTML}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderMonth(month: MonthGroup): string {
    const isExpanded = this.expandedMonths.has(month.key);
    const tasksHTML = month.tasks.map(entry => this.renderTask(entry)).join('');

    return `
      <div class="${changelogStyles.entry}">
        <button class="${changelogStyles.monthHeader} ${isExpanded ? changelogStyles.monthHeaderExpanded : ''}" data-month="${month.key}">
          <div class="${changelogStyles.monthInfo}">
            <span class="${changelogStyles.monthLabel}">${month.label}</span>
            <span class="${changelogStyles.monthMeta}">${month.totalTasks} задач</span>
          </div>
          <span class="${changelogStyles.weekToggle}">${isExpanded ? '▼' : '▶'}</span>
        </button>
        <div class="${changelogStyles.monthContent} ${isExpanded ? changelogStyles.monthContentExpanded : ''}">
          <div class="${changelogStyles.tasks}">
            ${tasksHTML}
          </div>
        </div>
      </div>
    `;
  }

  private renderTask(entry: MonthTask): string {
    const categoryHTML = entry.task.category
      ? `<span class="${changelogStyles.taskCategory}">${entry.task.category}</span>`
      : '';

    return `
      <div class="${changelogStyles.task}">
        <div class="${changelogStyles.taskHeader}">
          <div class="${changelogStyles.taskMeta}">
            <span class="${changelogStyles.taskWeek}">${entry.weekLabel}</span>
            ${categoryHTML}
          </div>
          <h4 class="${changelogStyles.taskTitle}">${entry.task.title}</h4>
        </div>
        <p class="${changelogStyles.taskDescription}">${entry.task.description}</p>
      </div>
    `;
  }

  private groupByMonth(entries: ChangelogEntry[]): MonthGroup[] {
    const monthMap = new Map<string, MonthGroup>();

    entries.forEach(entry => {
      const date = new Date(entry.week);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

      if (!monthMap.has(key)) {
        monthMap.set(key, {
          key,
          label,
          totalTasks: 0,
          tasks: [],
        });
      }

      const group = monthMap.get(key)!;
      const weekLabel = this.formatWeek(entry.week);
      const order = new Date(entry.week).getTime();
      entry.tasks.forEach(task => {
        group.tasks.push({ task, weekLabel, order });
      });
      group.totalTasks += entry.tasks.length;
    });

    return Array.from(monthMap.values())
      .map(group => {
        group.tasks.sort((a, b) => b.order - a.order);
        return group;
      })
      .sort((a, b) => b.key.localeCompare(a.key));
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
    const monthHeaders = this.container.querySelectorAll(`.${changelogStyles.monthHeader}`);
    monthHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const month = header.getAttribute('data-month');
        if (month) {
          if (this.expandedMonths.has(month)) {
            this.expandedMonths.delete(month);
          } else {
            this.expandedMonths.add(month);
          }
          this.renderContent();
        }
      });
    });
  }
}

