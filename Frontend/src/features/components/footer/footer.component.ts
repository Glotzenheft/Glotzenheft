import { Component } from '@angular/core';
import { getVisibleRoutes } from '../../../shared/variables/routes-list';
import { VisibleRoute } from '../../../shared/interfaces/route-list-item';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  footerLinkList: VisibleRoute[] = getVisibleRoutes();

  constructor(private router: Router) {}

  navigateToRoute = (selectedRoute: string) => {
    this.router.navigateByUrl(selectedRoute);
  };
}
