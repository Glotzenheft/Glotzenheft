import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MediaPageComponent } from './media-page/media-page.component';
import { FilmPageComponent } from './film-page/film-page.component';
import { TvPageComponent } from './tv-page/tv-page.component';
import { SeasonPageComponent } from './season-page/season-page.component';

const mediaRoutes: Routes = [
  {
    path: 'all', // overview over all media (= films + tv shows)
    component: MediaPageComponent,
  },
  {
    path: 'film/:id',
    component: FilmPageComponent,
  },
  { 
    path: 'tv/:id',
    component: TvPageComponent,
  },
  {
    path: 'tv/:id/season/:seasonID',
    component: SeasonPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(mediaRoutes)],
})
export class MediaModule {}
