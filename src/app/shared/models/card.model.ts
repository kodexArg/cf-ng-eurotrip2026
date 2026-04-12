export type CardType = 'info' | 'link' | 'note' | 'photo';

export interface Card {
  id: string;
  cityId: string;
  type: CardType;
  title: string;
  body: string | null;
  url: string | null;
  createdAt: string;
}
