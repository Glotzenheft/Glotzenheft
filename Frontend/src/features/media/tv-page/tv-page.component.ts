import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tv-page',
  imports: [],
  templateUrl: './tv-page.component.html',
  styleUrl: './tv-page.component.css',
})
export class TvPageComponent implements OnInit {
  tvSeriesID: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tvSeriesID = this.route.snapshot.paramMap.get('id');
  }
}
