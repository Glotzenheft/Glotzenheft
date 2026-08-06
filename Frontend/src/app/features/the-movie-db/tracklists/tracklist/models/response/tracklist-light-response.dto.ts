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

import {TracklistStatusEnum} from '../enums/tracklist-status.enum';
import {MediaLightDetailResponseDto} from '../../../../media/models/response/media-light-detail-response.dto';
import {
    TracklistTagLightResponseDto
} from '../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';

export interface TracklistLightResponseDto {
    id: number;
    tracklistName: string;
    createdAt: string;
    updatedAt: string | null;
    status: TracklistStatusEnum;
    rating: number | null;
    isRewatching: boolean;
    startDate: string | null;
    finishDate: string | null;
    customAirDate: string | null;
    language: string | null;
    subtitle: string | null;
    customPosterPath: string | null;
    media: MediaLightDetailResponseDto;
    tags: TracklistTagLightResponseDto[];
}
