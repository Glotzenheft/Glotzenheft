/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { TracklistStatusEnum } from '../../tracklists/tracklist/models/enums/tracklist-status.enum';
import { TracklistResponseDto } from '../../tracklists/tracklist/models/response/tracklist-response.dto';
import { MediaSeasonEpisodeDetailResponseDto } from '../models/response/media-season-episode-detail-response.dto';
import { MediaSeasonDetailResponseDto } from '../models/response/media-season-detail-response.dto';
import { TracklistEpisodeDetailDataDto } from '../../tracklists/tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';
import { TracklistSeasonDetailDataDto } from '../../tracklists/tracklist/models/response/tracklist-season/tracklist-season-detail-data.dto';
import { MediaType } from '../models/enums/media-type.enum';
import { MediaDetailDataResponseDto } from '../models/response/media-detail-data-response.dto';
import { MediaResponse } from '../models/response/media-response.dto';

export function createTracklistResponse(overrides: Partial<TracklistResponseDto> = {}): TracklistResponseDto {
    return {
        id: 42,
        tracklistName: 'My movie tracklist',
        status: TracklistStatusEnum.WATCHING,
        rating: 8,
        isRewatching: false,
        startDate: '2026-10-28 20:15:12',
        finishDate: null,
        comment: 'My movie note',
        customAirDate: '2024-06-15',
        language: 'ja',
        subtitle: 'de',
        customPosterPath: null,
        createdAt: '2026-10-28 20:15:12',
        updatedAt: null,
        tags: [],
        tracklistSeason: null,
        media: {
            id: 10,
            type: MediaType.MOVIE,
            posterPath: null,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        },
        ...overrides,
    };
}

export function createMediaDetailResponse(
    tracklists: TracklistResponseDto[] = [],
    media: Partial<MediaDetailDataResponseDto> = {},
): MediaResponse {
    return {
        media: {
            id: 10,
            type: MediaType.MOVIE,
            name: 'Movie',
            originalName: 'Original movie',
            description: 'A movie description',
            firstAirDate: '2024-06-15',
            posterPath: null,
            backdropPath: null,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
            tmdbId: 100,
            imdbId: null,
            tvdbId: null,
            wikidataId: null,
            facebookId: null,
            instagramId: null,
            twitterId: null,
            runtime: 120,
            adult: false,
            numberOfEpisodes: null,
            numberOfSeasons: null,
            originalLanguage: 'en',
            popularity: 10,
            status: 'Released',
            voteAverage: 8,
            voteCount: 100,
            homepage: null,
            tagline: null,
            budget: '0',
            revenue: '0',
            seasons: [],
            tmdbGenres: [],
            ...media,
        },
        tracklists,
    };
}

export function createSeriesEpisode(id = 60, episodeNumber = 1): MediaSeasonEpisodeDetailResponseDto {
    return {
        id,
        episodeNumber,
        tmdbEpisodeId: id * 10,
        name: `Episode ${episodeNumber}`,
        overview: 'Episode description',
        airDate: '2026-10-01',
        runtime: 24,
        stillPath: null,
        createdAt: '2026-10-01 19:00:00',
        updatedAt: null,
    };
}

export function createSeriesSeason(
    overrides: Partial<MediaSeasonDetailResponseDto> = {},
): MediaSeasonDetailResponseDto {
    return {
        id: 20,
        seasonNumber: 0,
        tmdbSeasonId: 200,
        name: 'Specials',
        overview: 'Season description',
        airDate: '2026-10-01',
        episodeCount: 3,
        posterPath: null,
        createdAt: '2026-10-01 19:00:00',
        updatedAt: null,
        episodes: [createSeriesEpisode(62, 3), createSeriesEpisode(60, 1), createSeriesEpisode(61, 2)],
        ...overrides,
    };
}

export function createEpisodeSighting(
    overrides: Partial<TracklistEpisodeDetailDataDto> = {},
): TracklistEpisodeDetailDataDto {
    return {
        id: 70,
        watchDateTime: null,
        createdAt: '2026-10-28 20:15:12',
        updatedAt: null,
        episode: { id: 60, episodeNumber: 1, createdAt: '2026-10-01 19:00:00', updatedAt: null },
        ...overrides,
    };
}

export function createSeriesTracklist(
    overrides: Partial<TracklistResponseDto> = {},
    season: Partial<TracklistSeasonDetailDataDto> = {},
): TracklistResponseDto {
    return createTracklistResponse({
        tracklistName: 'My series tracklist',
        media: {
            id: 11,
            type: MediaType.TV_SHOW,
            posterPath: null,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        },
        tracklistSeason: {
            id: 50,
            createdAt: '2026-10-28 20:15:12',
            updatedAt: null,
            customSeasonNumber: 0,
            customPartNumber: null,
            startEpisodeNumber: null,
            endEpisodeNumber: null,
            tracklistEpisodes: [],
            season: { id: 20, seasonNumber: 0, createdAt: '2026-10-01 19:00:00', updatedAt: null },
            ...season,
        },
        ...overrides,
    });
}

export function createSeriesMedia(
    tracklists: TracklistResponseDto[] = [],
    seasons = [createSeriesSeason()],
): MediaResponse {
    return createMediaDetailResponse(tracklists, {
        id: 11,
        type: MediaType.TV_SHOW,
        name: 'Series',
        runtime: null,
        numberOfSeasons: seasons.length,
        numberOfEpisodes: seasons.reduce((sum, season) => sum + season.episodeCount, 0),
        seasons,
    });
}
