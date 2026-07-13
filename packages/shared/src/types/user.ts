export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  subjectPreference: 'math' | 'chinese' | 'english' | 'geography' | 'physics';
  level: number;
  experience: number;
  subjectLevels: SubjectLevels;
  createdAt: Date;
}

export interface SubjectLevels {
  math: number;
  chinese: number;
  english: number;
  geography: number;
  physics: number;
}

export interface AuthToken {
  userId: string;
  username: string;
}
