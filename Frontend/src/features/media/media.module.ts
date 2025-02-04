import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MediaPageComponent } from './media-page/media-page.component';
import { FilmPageComponent } from './film-page/film-page.component';
import { TvPageComponent } from './tv-page/tv-page.component';
import { SeasonPageComponent } from './season-page/season-page.component';
import { ROUTES_LIST } from '../../shared/variables/routes-list';
import { MultiSearchComponent } from '../components/search/multi-search.component';

const mediaRoutes: Routes = [
  {
    path: 'all', // overview over all media (= films + tv shows)
    component: MediaPageComponent,
  },
  {
    path: ROUTES_LIST[6].shortUrl + '/:id',
    component: FilmPageComponent,
  },
  {
    path: ROUTES_LIST[7].shortUrl + '/:id',
    component: TvPageComponent,
  },
  {
    path: 'tv/:id/season/:seasonID',
    component: SeasonPageComponent,
  },
  {
    path: ROUTES_LIST[5].shortUrl,
    component: MultiSearchComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(mediaRoutes)],
})
export class MediaModule {}
