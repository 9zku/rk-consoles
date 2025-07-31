export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  gameUrl: string;
  year: number;
  genre: string;
  platform: 'web' | 'emulator';
  emulatorType?: 'nes' | 'snes' | 'n64' | 'ps1' | 'ps2' | 'gba' | 'nds';
  isNew?: boolean;
} 