import { Season } from '../shared/interfaces/media-interfaces';

export const TEST_SEASON: Season = {
  name: 'Test-Staffel',
  airDate: new Date(),
  episodes: [
    {
      mediaID: '123',
      seasonID: '456',
      airDate: new Date(),
      description: 'Dies ist eine Episode für eine Staffel.',
      episodeNumber: 10,
      name: 'Testepisode',
      posterPath: null,
      runtime: 22,
    },
    {
      mediaID: '123123',
      seasonID: '456456',
      airDate: new Date('01-02-2024'),
      description: 'Dies ist die erste Episode für eine Staffel.',
      episodeNumber: 1,
      name: 'Testepisode - 1',
      posterPath: null,
      runtime: 22,
    },
  ],
  tmdbSeasonID: '1',
  seasonNumber: 1,
  overview: 'Diese Staffel ist ein Test.',
  episodeCount: 12,
  posterPath: null,
  mediaID: '123456789',
};
