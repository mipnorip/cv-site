import headerStyles from '../styles/header.module.css';
import { ThemeManager } from '../utils/theme.js';

export class Header {
  private container: HTMLElement;
  private themeManager: ThemeManager;

  constructor(containerId: string, themeManager: ThemeManager) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.themeManager = themeManager;
  }

  render(): void {
    const currentTheme = this.themeManager.getTheme();
    this.container.innerHTML = `
      <nav class="${headerStyles.nav}">
        <div class="${headerStyles.logo}">
          <a href="#personal-info" class="${headerStyles.logoLink}">Илья Маслов</a>
        </div>
        <div class="${headerStyles.rightSection}">
          <ul class="${headerStyles.menu}">
            <li><a href="#personal-info" class="${headerStyles.menuLink}">О себе</a></li>
            <li><a href="#experience" class="${headerStyles.menuLink}">Опыт</a></li>
            <li><a href="#projects" class="${headerStyles.menuLink}">Проекты</a></li>
            <li><a href="#changelog" class="${headerStyles.menuLink}">Changelog</a></li>
          </ul>
          <button class="${headerStyles.themeToggle}" aria-label="Toggle theme" title="Переключить тему">
            <span class="${headerStyles.themeIcon}">${currentTheme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <button class="${headerStyles.menuToggle}" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // Smooth scroll for navigation links
    const links = this.container.querySelectorAll(`.${headerStyles.menuLink}`);
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Theme toggle
    const themeToggle = this.container.querySelector(`.${headerStyles.themeToggle}`);
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.themeManager.toggleTheme();
        const icon = themeToggle.querySelector(`.${headerStyles.themeIcon}`);
        if (icon) {
          icon.textContent = this.themeManager.getTheme() === 'dark' ? '☀️' : '🌙';
        }
      });
    }

    // Mobile menu toggle
    const menuToggle = this.container.querySelector(`.${headerStyles.menuToggle}`);
    const menu = this.container.querySelector(`.${headerStyles.menu}`);
    if (menuToggle && menu) {
      menuToggle.addEventListener('click', () => {
        menu.classList.toggle(headerStyles.menuOpen);
        menuToggle.classList.toggle(headerStyles.menuToggleActive);
      });
    }
  }
}

