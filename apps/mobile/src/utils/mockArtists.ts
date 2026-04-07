import type { Artist } from '@/types/artist.types';

const makeArtist = (id: number, name: string, fans: number): Artist => ({
  id,
  name,
  nb_fan: fans,
  picture: `https://picsum.photos/seed/deezer-artist-${id}/600/600`,
  picture_xl: `https://picsum.photos/seed/deezer-artist-${id}/1000/1000`,
});

export const mockArtists: Artist[] = [
  makeArtist(1, 'The Weeknd', 39450000),
  makeArtist(2, 'Dua Lipa', 25300000),
  makeArtist(3, 'Drake', 28600000),
  makeArtist(4, 'Billie Eilish', 21900000),
  makeArtist(5, 'Bad Bunny', 20800000),
  makeArtist(6, 'Taylor Swift', 31400000),
  makeArtist(7, 'Ariana Grande', 23300000),
  makeArtist(8, 'Travis Scott', 17400000),
  makeArtist(9, 'Beyonce', 19000000),
  makeArtist(10, 'Rihanna', 27100000),
  makeArtist(11, 'Post Malone', 18400000),
  makeArtist(12, 'Doja Cat', 12900000),
  makeArtist(13, 'Bruno Mars', 20200000),
  makeArtist(14, 'SZA', 12100000),
  makeArtist(15, 'Kendrick Lamar', 15700000),
  makeArtist(16, 'Imagine Dragons', 18300000),
  makeArtist(17, 'Lana Del Rey', 11600000),
  makeArtist(18, 'Rosalia', 9800000),
  makeArtist(19, 'Karol G', 11200000),
  makeArtist(20, 'Calvin Harris', 10800000),
];
