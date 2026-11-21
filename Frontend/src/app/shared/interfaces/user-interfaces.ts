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

import { MediaType } from '../../features/the-movie-db/media/models/enums/media-type.enum';

export type ActivitySortOrder = 'desc' | 'asc';

export interface ActivityPageRequestDto {
    user_activity_page: number;
    items_per_page: number;
    media_type?: MediaType;
    search?: string;
    sort_order?: ActivitySortOrder;
}

export interface ActivityMedia {
    id: number;
    type: MediaType;
}

export interface ActivityDayResponseDto {
    day: string;
    count: number;
    minutes: number;
}

interface UserMenuItem {
    label: string;
    icon: string;
    command: () => void;
}

export interface UserMenuList {
    label: string;
    items: UserMenuItem[];
}

export interface DeleteUserRequest {
    security_question: string;
    security_answer: string;
}

export interface UserActivity {
    date: string;
    episodeID: number | null;
    episodeNumber: number | null;
    mediaID: number;
    mediaTitle: string;
    posterPath: string | null;
    runtime: number | null;
    seasonID: number | null;
    seasonNumber: number | null;
    stillPath: string | null; // if episode
    tracklistEpisodeID: number | null;
    tracklistID: number;
    tracklistName: string;
    tracklistSeasonID: number | null;
    type: string;
}

export interface UserActivitiesResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: UserActivity[];
    days: ActivityDayResponseDto[];
}
