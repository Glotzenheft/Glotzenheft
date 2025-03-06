import { Component, Output, EventEmitter } from '@angular/core';
import { getVisibleRoutes } from '../../../shared/variables/routes-list';
import { VisibleRoute } from '../../../shared/interfaces/route-list-item';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  footerLinkList: { label: string; command: () => void }[] =
    getVisibleRoutes().map((route: VisibleRoute) => {
      return {
        label: route.description,
        command: () => {
          this.router.navigateByUrl(route.fullUrl);
        },
      };
    });

  constructor(private router: Router) {}

  navigateToRoute = (selectedRoute: string) => {
    this.router.navigateByUrl(selectedRoute);
  };

  @Output() sideBarOpenEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  closeSidebar = () => {
    this.sideBarOpenEvent.emit(false);
  };
}
