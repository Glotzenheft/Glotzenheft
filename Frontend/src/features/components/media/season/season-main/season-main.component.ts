import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-season-main',
  imports: [CommonModule],
  templateUrl: './season-main.component.html',
  styleUrl: './season-main.component.css',
})
export class SeasonMainComponent implements OnInit {
  seasonID: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.seasonID = this.route.snapshot.paramMap.get('id');
  }
}
