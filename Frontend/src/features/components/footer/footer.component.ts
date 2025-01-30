import { Component, Output, EventEmitter } from '@angular/core';
import { getVisibleRoutes } from '../../../shared/variables/routes-list';
import { VisibleRoute } from '../../../shared/interfaces/route-list-item';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, ButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  footerLinkList: VisibleRoute[] = getVisibleRoutes();

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
