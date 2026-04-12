export type CardType = 'info' | 'link' | 'note' | 'photo';

export interface CardLink {
  id: string;
  url: string;
  label: string;
  tooltip: string | null;
  sortOrder: number;
}

export interface Card {
  id: string;
  cityId: string;
  type: CardType;
  title: string;
  body: string | null;
  url: string | null;
  links: CardLink[];
  createdAt: string;
}
