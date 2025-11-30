import type { PersonalData } from '../types/index.js';
import footerStyles from '../styles/footer.module.css';

export class Footer {
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  render(personalData: PersonalData): void {
    const currentYear = new Date().getFullYear();
    const socialLinks = this.renderSocialLinks(personalData.contacts);

    this.container.innerHTML = `
      <div class="${footerStyles.container}" data-animate="fade">
        <div class="${footerStyles.content}">
          <p class="${footerStyles.copyright}">
            © ${currentYear} ${personalData.name}. Все права защищены (или нет).
          </p>
          <div class="${footerStyles.social}">
            ${socialLinks}
          </div>
        </div>
      </div>
    `;
  }

  private renderSocialLinks(contacts: PersonalData['contacts']): string {
    const links: string[] = [];

    if (contacts.github) {
      const githubUrl = contacts.github.startsWith('http') ? contacts.github : `https://${contacts.github}`;
      links.push(`
        <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="${footerStyles.socialLink}" aria-label="GitHub">
          GitHub
        </a>
      `);
    }

    if (contacts.linkedin) {
      const linkedinUrl = contacts.linkedin.startsWith('http') ? contacts.linkedin : `https://${contacts.linkedin}`;
      links.push(`
        <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="${footerStyles.socialLink}" aria-label="LinkedIn">
          LinkedIn
        </a>
      `);
    }

    if (contacts.telegram) {
      links.push(`
        <a href="https://t.me/${contacts.telegram.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="${footerStyles.socialLink}" aria-label="Telegram">
          Telegram
        </a>
      `);
    }

    if (contacts.email) {
      links.push(`
        <a href="mailto:${contacts.email}" class="${footerStyles.socialLink}" aria-label="Email">
          Email
        </a>
      `);
    }

    return links.join('');
  }
}

