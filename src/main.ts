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
  const selector = '[data-animate="fade"]';
  const animatedElements = (): HTMLElement[] => Array.from(document.querySelectorAll<HTMLElement>(selector));
  const processed = new WeakSet<HTMLElement>();
  const htmlElement = document.documentElement;

  const reveal = (element: HTMLElement): void => {
    element.classList.add('is-visible');
  };

  const isInViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * -0.1;
  };

  let observer: IntersectionObserver | null = null;

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );
  }

  const processElement = (element: HTMLElement): void => {
    if (processed.has(element)) {
      return;
    }
    processed.add(element);

    if (!observer) {
      reveal(element);
      return;
    }

    if (isInViewport(element)) {
      reveal(element);
    } else {
      observer.observe(element);
    }
  };

  const scanForElements = (): void => {
    animatedElements().forEach(processElement);
  };

  scanForElements();

  const enableAnimations = (): void => {
    if (!htmlElement.classList.contains('animations-ready')) {
      htmlElement.classList.add('animations-ready');
    }
  };

  enableAnimations();

  window.addEventListener('load', () => {
    scanForElements();
    setTimeout(() => {
      animatedElements().forEach(reveal);
    }, 2000);
  });

  const mutationObserver = new MutationObserver(() => {
    scanForElements();
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
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

