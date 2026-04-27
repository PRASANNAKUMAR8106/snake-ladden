/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration: number;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synth Enthusiast',
    cover: 'https://picsum.photos/seed/neon/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: '2',
    title: 'Digital Abyss',
    artist: 'Cyber Voyager',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
  },
  {
    id: '3',
    title: 'Glitch in the Grid',
    artist: 'Data Drift',
    cover: 'https://picsum.photos/seed/glitch/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 318,
  },
];

export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;
export const INITIAL_SPEED = 150;
