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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../shared/variables/routes-list';
import { MEDIA_DETAILS_URLS } from '../../core/constants/urls.constants';
import { I_NavigationRepository } from '../../core/interfaces/navigation.repository';

@Injectable({
    providedIn: 'root',
})
export class R_Navigation implements I_NavigationRepository {
    constructor(private router: Router) {}

    public navigateToStartPage = () => {
        void this.router.navigateByUrl('');
    };

    public navigateToUserStart = () => {
        void this.router.navigateByUrl('user');
    };

    public navigateToMultiSearch = () => {
        void this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
    };

    public navigateToPage = (tmdbId: string, isMovie: boolean) => {
        void this.router.navigateByUrl(
            `${isMovie ? MEDIA_DETAILS_URLS.movieUrl : MEDIA_DETAILS_URLS.tvUrl}/${tmdbId}`,
        );
    };

    public navigateToSpecificPage = (url: string) => {
        void this.router.navigateByUrl(url);
    };
}
