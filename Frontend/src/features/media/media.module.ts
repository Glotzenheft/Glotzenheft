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
