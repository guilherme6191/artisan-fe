export type Lead = {
  id: number;
  name: string;
  email: string;
  company: string;
  stage: number;
  engaged: boolean;
  lastContacted: Date;
  initials: string;
};
