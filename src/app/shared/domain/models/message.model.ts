export type Direction =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface Message {
  id: string;
  content: string;
  direction: Direction;
  isDark?: boolean;
}
