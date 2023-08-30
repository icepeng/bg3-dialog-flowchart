export interface TranslationUnit {
  id: number;
  position: number;
  context: string;
  source: string;
  target: string;
  fuzzy: boolean;
  approved: boolean;
  component: string;
  checksum: string;
}

export type TranslationData = {
  [context: string]: TranslationUnit;
};
