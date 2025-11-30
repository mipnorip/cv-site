export interface PersonalData {
  name: string;
  age: number;
  position: string;
  photo: string;
  contacts: {
    email?: string;
    phone?: string;
    telegram?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Experience {
  company: string;
  position: string;
  period: {
    start: string; // "YYYY-MM"
    end: string | "present"; // "YYYY-MM" или "present"
  };
  description: string[];
  technologies?: string[];
}

export interface Project {
  title: string;
  description: string;
  type: "hobby" | "personal";
  link?: string;
  technologies: string[];
  image?: string;
}

export interface ChangelogTask {
  title: string;
  description: string;
  category?: string;
}

export interface ChangelogEntry {
  week: string; // "YYYY-MM-DD" (дата начала недели)
  tasks: ChangelogTask[];
}

