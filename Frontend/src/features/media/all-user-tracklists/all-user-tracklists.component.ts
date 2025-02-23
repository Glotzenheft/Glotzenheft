import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../../service/media/media.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { CommonModule } from '@angular/common';
import { TMDB_POSTER_PATH } from '../../../shared/variables/tmdb-vars';
import { CardModule } from 'primeng/card';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { Tracklist } from '../../../shared/interfaces/tracklist-interfaces';

@Component({
  selector: 'app-all-user-tracklists',
  imports: [
    CommonModule,
    CardModule,
    DateFormattingPipe,
    DialogModule,
    TableModule,
    AccordionModule,
  ],
  templateUrl: './all-user-tracklists.component.html',
  styleUrl: './all-user-tracklists.component.css',
})
export class AllUserTracklistsComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;
  public posterPath: string = TMDB_POSTER_PATH;
  public isDialogVisible: boolean = false;
  public currentTracklist: Tracklist | null = null;

  constructor(private mediaService: MediaService, private router: Router) {}

  ngOnInit(): void {
    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      return;
    }

    this.userTracklists$.subscribe({
      next: () => {},
      error: (err) => {
        if (err.status === 401) {
          this.router.navigateByUrl(`/${ROUTES_LIST[1].fullUrl}`);
        }
      },
    });
  }

  public navigateToDetailspage = (mediaID: number, mediaType: string) => {
    let url: string =
      mediaType.trim() === 'movie'
        ? `${ROUTES_LIST[5].fullUrl}/${mediaID}`
        : `${ROUTES_LIST[6].fullUrl}/${mediaID}`;

    this.router.navigateByUrl(url);
  };
}
