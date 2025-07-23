export interface ResumeExperience {
  id: string;
  description: string;
  position: string;
}

export interface Resume {
  id: string;
  experience: ResumeExperience[];
  other: string;
  projects: string;
  skills: string;
}
