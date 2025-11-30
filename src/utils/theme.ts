export type Theme = 'light' | 'dark';

export class ThemeManager {
  private currentTheme: Theme;

  constructor() {
    // Проверяем сохраненную тему или системную
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.currentTheme = savedTheme || systemTheme;
    // Применяем тему сразу, до загрузки DOM
    this.applyTheme(this.currentTheme);
    
    // Слушаем изменения системной темы (только если тема не сохранена вручную)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }
}

