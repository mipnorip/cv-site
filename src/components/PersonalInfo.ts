import type { PersonalData } from '../types/index.js';
import personalStyles from '../styles/personal.module.css';

export class PersonalInfo {
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  render(data: PersonalData): void {
    const contactsHTML = this.renderContacts(data.contacts);

    this.container.innerHTML = `
      <div class="${personalStyles.container}">
        <div class="${personalStyles.content}">
          <div class="${personalStyles.imageWrapper}">
            <img src="${data.photo}" alt="${data.name}" class="${personalStyles.photo}" />
          </div>
          <div class="${personalStyles.info}">
            <h1 class="${personalStyles.name}">${data.name}</h1>
            <p class="${personalStyles.position}">${data.position}</p>
            <p class="${personalStyles.age}">${data.age} лет</p>
            <div class="${personalStyles.contacts}">
              ${contactsHTML}
            </div>
          </div>
        </div>
      </div>
    `;
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
}

