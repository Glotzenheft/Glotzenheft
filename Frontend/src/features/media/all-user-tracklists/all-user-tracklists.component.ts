import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../../service/media/media.service';
import { Observable } from 'rxjs';
import { Tracklist } from '../../../shared/interfaces/media-interfaces';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-user-tracklists',
  imports: [CommonModule],
  templateUrl: './all-user-tracklists.component.html',
  styleUrl: './all-user-tracklists.component.css',
})
export class AllUserTracklistsComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;

  constructor(private mediaService: MediaService, private router: Router) {}

  ngOnInit(): void {
    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      return;
    }

    this.userTracklists$.subscribe({
      next: () => {
        console.log('works');
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigateByUrl(`/${ROUTES_LIST[1].fullUrl}`);
        }
      },
    });
  }
}
