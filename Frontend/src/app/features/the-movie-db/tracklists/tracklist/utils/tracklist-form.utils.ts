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

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MediaType } from '../../../media/models/enums/media-type.enum';
import { TracklistStatusEnum } from '../models/enums/tracklist-status.enum';
import { TracklistFormDialogData } from '../models/tracklist-form-dialog-data';
import { TracklistFormValue } from '../models/tracklist-form-value';
import { UpdateTracklistRequestDto } from '../models/request/update-tracklist-request.dto';

/** Parse the API's date-only and local datetime formats without shifting to UTC. */
export function parseTracklistDate(value: string | null): Date | null {
    if (!value) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?$/.exec(value);
    if (!match) return null;
    const [, year, month, day, hour = '0', minute = '0', second = '0'] = match;
    const date = new Date(0);
    date.setFullYear(Number(year), Number(month) - 1, Number(day));
    date.setHours(Number(hour), Number(minute), Number(second), 0);
    return date.getFullYear() === Number(year) &&
        date.getMonth() === Number(month) - 1 &&
        date.getDate() === Number(day) &&
        date.getHours() === Number(hour) &&
        date.getMinutes() === Number(minute) &&
        date.getSeconds() === Number(second)
        ? date
        : null;
}

export function formatTracklistDate(value: Date | null, withTime = false): string | null {
    if (!value) return null;
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
        throw new Error('Cannot submit an invalid tracklist date.');
    }
    const pad = (part: number) => String(part).padStart(2, '0');
    const date = `${String(value.getFullYear()).padStart(4, '0')}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
    return withTime
        ? `${date} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`
        : date;
}

export function getTracklistFormValue(data: TracklistFormDialogData, now = new Date()): TracklistFormValue {
    const tracklist = data.mode === 'edit' ? data.tracklist : null;
    const season = tracklist?.tracklistSeason;
    const createSeason = data.mode === 'create' && data.mediaType === MediaType.TV_SHOW ? data.season : null;
    const firstEpisode = createSeason
        ? [...createSeason.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber)[0]
        : undefined;
    const airDate =
        data.mode === 'edit'
            ? data.tracklist.customAirDate
            : createSeason
              ? (createSeason.airDate ?? firstEpisode?.airDate ?? null)
              : data.media.firstAirDate;

    return {
        tracklistName:
            tracklist?.tracklistName ??
            (data.mode === 'create'
                ? data.media.name + (createSeason ? ` - Staffel ${createSeason.seasonNumber}` : '')
                : ''),
        status: tracklist?.status ?? TracklistStatusEnum.WATCHING,
        rating: tracklist?.rating ?? null,
        isRewatching: tracklist?.isRewatching ?? false,
        startDate: tracklist ? parseTracklistDate(tracklist.startDate) : new Date(now.getTime()),
        finishDate: parseTracklistDate(tracklist?.finishDate ?? null),
        comment: tracklist?.comment ?? null,
        customAirDate: parseTracklistDate(airDate),
        language: tracklist?.language ?? null,
        subtitle: tracklist?.subtitle ?? null,
        customPosterPath: tracklist?.customPosterPath ?? null,
        startEpisodeNumber: season?.startEpisodeNumber ?? (createSeason ? 1 : null),
        endEpisodeNumber: season?.endEpisodeNumber ?? null,
        customSeasonNumber: season?.customSeasonNumber ?? createSeason?.seasonNumber ?? null,
        customPartNumber: season?.customPartNumber ?? null,
    };
}

export function toTracklistRequest(
    value: TracklistFormValue,
    isMovie: boolean,
): UpdateTracklistRequestDto &
    Required<Pick<UpdateTracklistRequestDto, 'tracklist_name' | 'tracklist_status'>> {
    return {
        tracklist_name: value.tracklistName.trim(),
        tracklist_status: value.status,
        tracklist_rating: value.rating,
        is_rewatching: value.isRewatching,
        tracklist_start_date: formatTracklistDate(value.startDate, true),
        tracklist_finish_date: formatTracklistDate(value.finishDate, true),
        comment: value.comment,
        custom_air_date: formatTracklistDate(value.customAirDate),
        language: value.language,
        subtitle: value.subtitle,
        custom_poster_path: value.customPosterPath,
        ...(!isMovie
            ? {
                  start_episode_number: value.startEpisodeNumber,
                  end_episode_number: value.endEpisodeNumber,
                  custom_season_number: value.customSeasonNumber,
                  custom_part_number: value.customPartNumber,
              }
            : {}),
    };
}

export const optionalDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;
    return value === null || (value instanceof Date && Number.isFinite(value.getTime()))
        ? null
        : { date: true };
};

export function optionalInteger(minimum: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: unknown = control.value;
        return value === null || (typeof value === 'number' && Number.isInteger(value) && value >= minimum)
            ? null
            : { integer: true };
    };
}

export const tracklistRanges: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const start: unknown = form.get('startDate')?.value;
    const finish: unknown = form.get('finishDate')?.value;
    const first: unknown = form.get('startEpisodeNumber')?.value;
    const last: unknown = form.get('endEpisodeNumber')?.value;
    const errors: ValidationErrors = {};
    if (start instanceof Date && finish instanceof Date && start.getTime() > finish.getTime()) {
        errors['dateRange'] = true;
    }
    if (typeof first === 'number' && typeof last === 'number' && first > last) {
        errors['episodeRange'] = true;
    }
    return Object.keys(errors).length ? errors : null;
};
