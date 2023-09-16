export interface TranslationUnit {
  id: number;
  position: number;
  context: string;
  source: string;
  target: string;
  state: (typeof TranslationState)[keyof typeof TranslationState];
  component: string;
  checksum: string;
}

export const TranslationState = {
  EMPTY: 0,
  FUZZY: 10,
  TRANSLATED: 20,
  APPROVED: 30,
  READONLY: 100,
} as const;

export type TranslationData = {
  [context: string]: TranslationUnit;
};
