// Vimeo Player API types
export interface VimeoPlayer {
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event: string, callback?: (data?: any) => void) => void;
  ready: () => Promise<void>;
  getDuration: () => Promise<number>;
  getPaused: () => Promise<boolean>;
  getCurrentTime: () => Promise<number>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getVolume: () => Promise<number>;
  setCurrentTime: (seconds: number) => Promise<void>;
}

declare global {
  interface Window {
    Vimeo: {
      Player: new (element: HTMLIFrameElement) => VimeoPlayer;
    };
  }
}

export {};
