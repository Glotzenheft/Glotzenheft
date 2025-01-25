import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-season-page',
  imports: [],
  templateUrl: './season-page.component.html',
  styleUrl: './season-page.component.css',
})
export class SeasonPageComponent implements OnInit {
  seasonID: string | null = null;
  tvSeriesID: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.seasonID = this.route.snapshot.paramMap.get('seasonID');
    this.tvSeriesID = this.route.snapshot.paramMap.get('id');
  }
}
