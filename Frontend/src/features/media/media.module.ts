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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FilmPageComponent } from './mediaDetailsCOMPONENTS/film-page/film-page.component';
import { SeasonPageComponent } from './mediaDetailsCOMPONENTS/season-page/season-page.component';
import { MultiSearchComponent } from './mediaSearchCOMPONENTS/search/multi-search.component';
import { ROUTES_LIST } from '../../app/shared/variables/routes-list';

const mediaRoutes: Routes = [
    {
        path: 'all', // overview over all media (= films + tv shows)
        component: FilmPageComponent,
    },
    {
        path: ROUTES_LIST[5].shortUrl + '/:id',
        component: FilmPageComponent,
    },
    {
        path: ROUTES_LIST[6].shortUrl + '/:id',
        component: SeasonPageComponent,
    },
    {
        path: ROUTES_LIST[4].shortUrl,
        component: MultiSearchComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(mediaRoutes)],
})
export class MediaModule { }
