import { Header } from './components/Header.js';
import { PersonalInfo } from './components/PersonalInfo.js';
import { Experience } from './components/Experience.js';
import { Projects } from './components/Projects.js';
import { Changelog } from './components/Changelog.js';
import { Footer } from './components/Footer.js';
import {
  loadPersonalData,
  loadExperience,
  loadProjects,
  loadChangelog,
} from './utils/dataLoader.js';
import { ThemeManager } from './utils/theme.js';
import './styles/main.module.css';

function initScrollAnimations(): void {
  const animatedElements = document.querySelectorAll<HTMLElement>('[data-animate="fade"]');
  if (!animatedElements.length) {
    return;
  }

  const reveal = (element: HTMLElement): void => {
    element.classList.add('is-visible');
  };

  const isInViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * -0.1;
  };

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(element => reveal(element));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  animatedElements.forEach(element => {
    if (isInViewport(element)) {
      reveal(element);
    } else {
      observer.observe(element);
    }
  });

  window.addEventListener('load', () => {
    animatedElements.forEach(element => {
      if (!element.classList.contains('is-visible') && isInViewport(element)) {
        reveal(element);
      }
    });
  });
}

async function init() {
  try {
    // Initialize theme manager first
    const themeManager = new ThemeManager();

    // Load all data
    const [personalData, experience, projects, changelog] = await Promise.all([
      loadPersonalData(),
      loadExperience(),
      loadProjects(),
      loadChangelog(),
    ]);

    // Initialize and render components
    const header = new Header('header', themeManager);
    header.render();

    const personalInfo = new PersonalInfo('personal-info');
    personalInfo.render(personalData);

    const experienceComponent = new Experience('experience');
    experienceComponent.render(experience);

    const projectsComponent = new Projects('projects');
    projectsComponent.render(projects);

    const changelogComponent = new Changelog('changelog');
    changelogComponent.render(changelog);

    const footer = new Footer('footer');
    footer.render(personalData);

    initScrollAnimations();
  } catch (error) {
    console.error('Error initializing application:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <h1>Ошибка загрузки данных</h1>
          <p>${error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

