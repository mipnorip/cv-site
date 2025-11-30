import type { PersonalData } from '../types/index.js';
import personalStyles from '../styles/personal.module.css';

export class PersonalInfo {
  private container: HTMLElement;
  private typingInitialized = false;
  private readonly birthDate = new Date('2002-08-03T00:00:00');
  private readonly rotatingRoles = [
    'Devops',
    'Pentester',
    'Python developer',
    'Script kiddi',
    'Promt engener',
    'Просто парень из Воронежа',
    'ChatOps',
  ];

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  render(data: PersonalData): void {
    const contactsHTML = this.renderContacts(data.contacts);
    const preciseAge = this.formatAgeString(this.calculatePreciseAge());
    const defaultRole = ''; // Start with empty role, like name
    const longestRole = this.rotatingRoles.reduce((longest, current) =>
      current.length > longest.length ? current : longest
    );
    const longestRoleUpper = longestRole.toUpperCase();
    
    // Measure actual width of longest role text
    const measureElement = document.createElement('span');
    measureElement.style.position = 'absolute';
    measureElement.style.visibility = 'hidden';
    measureElement.style.whiteSpace = 'nowrap';
    measureElement.style.fontSize = '1.1rem';
    measureElement.style.fontWeight = '600';
    measureElement.style.fontFamily = 'var(--font-heading)';
    measureElement.style.letterSpacing = '1px';
    measureElement.style.textTransform = 'uppercase';
    measureElement.textContent = longestRoleUpper;
    document.body.appendChild(measureElement);
    const measuredWidth = measureElement.offsetWidth;
    document.body.removeChild(measureElement);
    const widthInRem = (measuredWidth / parseFloat(getComputedStyle(document.documentElement).fontSize)) + 2; // Add 2rem padding

    this.container.innerHTML = `
      <div class="${personalStyles.container}" data-animate="fade">
        <div class="${personalStyles.content}">
          <div class="${personalStyles.cornerBolt} ${personalStyles.cornerBoltTopLeft}"></div>
          <div class="${personalStyles.cornerBolt} ${personalStyles.cornerBoltTopRight}"></div>
          <div class="${personalStyles.cornerBolt} ${personalStyles.cornerBoltBottomLeft}"></div>
          <div class="${personalStyles.cornerBolt} ${personalStyles.cornerBoltBottomRight}"></div>
          <div class="${personalStyles.imageWrapper}">
            <div class="${personalStyles.photoFrame}">
              <img src="${data.photo}" alt="${data.name}" class="${personalStyles.photo}" />
            </div>
          </div>
          <div class="${personalStyles.info}">
            <div class="${personalStyles.nameSection}">
              <h1 class="${personalStyles.name}">
                <span class="${personalStyles.typedName}" data-name="${data.name.toUpperCase()}">${data.name.toUpperCase()}</span>
                <span class="${personalStyles.typingCursor}" aria-hidden="true"></span>
              </h1>
              <div class="${personalStyles.divider}"></div>
            </div>
            <p class="${personalStyles.position}" style="--role-width: ${widthInRem}rem;">
              <span class="${personalStyles.typedRole}" data-placeholder="${longestRoleUpper}">${defaultRole}</span>
              <span class="${personalStyles.rolePlaceholder}" aria-hidden="true">${longestRoleUpper}</span>
            </p>
            <p class="${personalStyles.age}">AGE: ${preciseAge}</p>
            <div class="${personalStyles.contacts} ${personalStyles.contactsHidden}">
              ${contactsHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    this.initTypingEffect(data.name);
  }

  private renderContacts(contacts: PersonalData['contacts']): string {
    const contactItems: string[] = [];

    if (contacts.email) {
      contactItems.push(`
        <a href="mailto:${contacts.email}" class="${personalStyles.contactLink}">
          <span class="${personalStyles.contactIcon}">✉</span>
          <span class="${personalStyles.contactText}">${contacts.email}</span>
        </a>
      `);
    }

    if (contacts.phone) {
      contactItems.push(`
        <a href="tel:${contacts.phone}" class="${personalStyles.contactLink}">
          <span class="${personalStyles.contactIcon}">📞</span>
          <span class="${personalStyles.contactText}">${contacts.phone}</span>
        </a>
      `);
    }

    if (contacts.telegram) {
      contactItems.push(`
        <a href="https://t.me/${contacts.telegram.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="${personalStyles.contactLink}">
          <span class="${personalStyles.contactIcon}">✈</span>
          <span class="${personalStyles.contactText}">${contacts.telegram}</span>
        </a>
      `);
    }

    if (contacts.github) {
      const githubUrl = contacts.github.startsWith('http') ? contacts.github : `https://${contacts.github}`;
      contactItems.push(`
        <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="${personalStyles.contactLink}">
          <span class="${personalStyles.contactIcon}">🐙</span>
          <span class="${personalStyles.contactText}">GitHub</span>
        </a>
      `);
    }

    if (contacts.linkedin) {
      const linkedinUrl = contacts.linkedin.startsWith('http') ? contacts.linkedin : `https://${contacts.linkedin}`;
      contactItems.push(`
        <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="${personalStyles.contactLink}">
          <span class="${personalStyles.contactIcon}">💼</span>
          <span class="${personalStyles.contactText}">LinkedIn</span>
        </a>
      `);
    }

    return contactItems.join('');
  }

  private initTypingEffect(name: string): void {
    if (this.typingInitialized) {
      return;
    }
    const nameElement = this.container.querySelector<HTMLElement>(`.${personalStyles.typedName}`);
    const roleElement = this.container.querySelector<HTMLElement>(`.${personalStyles.typedRole}`);
    const cursorElement = this.container.querySelector<HTMLElement>(`.${personalStyles.typingCursor}`);

    if (!nameElement || !roleElement || !cursorElement) {
      return;
    }

    this.typingInitialized = true;
    const nameText = name.toUpperCase();
    const roles = this.rotatingRoles.map(role => role.toUpperCase());

    const moveCursor = (target: HTMLElement) => {
      target.insertAdjacentElement('afterend', cursorElement);
    };

    const typeText = async (element: HTMLElement, text: string, speed: number) => {
      element.dataset.currentLength = String(text.length);
      element.textContent = '';
      for (const char of text) {
        element.textContent += char;
        await this.wait(speed);
      }
    };

    const deleteText = async (element: HTMLElement, speed: number) => {
      const targetLength = Number(element.dataset.placeholderLength ?? element.dataset.currentLength ?? 0);
      while ((element.textContent ?? '').length > 0) {
        element.textContent = (element.textContent ?? '').slice(0, -1);
        await this.wait(speed);
      }
      element.dataset.currentLength = String(targetLength);
    };

    const showContacts = () => {
      const contactsElement = this.container.querySelector<HTMLElement>(`.${personalStyles.contacts}`);
      if (contactsElement) {
        contactsElement.classList.remove(personalStyles.contactsHidden);
      }
    };

    const loopRoles = async () => {
      let index = 0;
      let firstRoleShown = false;
      while (true) {
        const role = roles[index];
        moveCursor(roleElement);
        if (firstRoleShown) {
          await deleteText(roleElement, 45);
        }
        await typeText(roleElement, role, 90);
        
        // Show contacts after first role is fully typed
        if (!firstRoleShown) {
          firstRoleShown = true;
          await this.wait(300); // Small delay after typing completes
          showContacts();
        }
        
        await this.wait(1200);
        index = (index + 1) % roles.length;
      }
    };

    const startTyping = async () => {
      moveCursor(nameElement);
      await typeText(nameElement, nameText, 100);
      await this.wait(500);
      moveCursor(roleElement);
      await loopRoles();
    };

    void startTyping();
  }

  private calculatePreciseAge(reference: Date = new Date()): { years: number; months: number; days: number } {
    let years = reference.getFullYear() - this.birthDate.getFullYear();
    let months = reference.getMonth() - this.birthDate.getMonth();
    let days = reference.getDate() - this.birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
      days += previousMonth.getDate();
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days };
  }

  private formatAgeString(age: { years: number; months: number; days: number }): string {
    const years = this.formatUnit(age.years, ['год', 'года', 'лет']);
    const months = this.formatUnit(age.months, ['месяц', 'месяца', 'месяцев']);
    const days = this.formatUnit(age.days, ['день', 'дня', 'дней']);
    return `${years} · ${months} · ${days}`;
  }

  private formatUnit(value: number, forms: [string, string, string]): string {
    const mod10 = value % 10;
    const mod100 = value % 100;

    let form = forms[2];
    if (mod10 === 1 && mod100 !== 11) {
      form = forms[0];
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      form = forms[1];
    }

    return `${value} ${form}`;
  }

  private wait(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
}

