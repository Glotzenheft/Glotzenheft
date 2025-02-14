import { Route, Routes } from '@angular/router';
import { RoutesListItem, VisibleRoute } from '../interfaces/route-list-item';

export const ROUTES_LIST: RoutesListItem[] = [
  {
    description: 'Impressum',
    fullUrl: 'imprint',
    shortUrl: 'imprint',
    showInLinkList: true,
  },
  {
    description: 'Über uns',
    fullUrl: 'about',
    shortUrl: 'about',
    showInLinkList: true,
  },
  {
    description: 'Datenschutzerklärung',
    fullUrl: 'privacy-policy',
    shortUrl: 'privacy-policy',
    showInLinkList: true,
  },
  {
    description: 'Details',
    fullUrl: 'media/BLOCKED',
    shortUrl: 'season/:id',
    showInLinkList: false,
  },
  {
    description: 'Multisuche',
    fullUrl: 'media/multi-search',
    shortUrl: 'multi-search',
    showInLinkList: false,
  },
  {
    description: 'Filmübersicht',
    fullUrl: 'media/movie', // /:id
    shortUrl: 'movie', // /:id,
    showInLinkList: false,
  },
  {
    description: 'Serienübersicht',
    fullUrl: 'media/tv', // /:id,
    shortUrl: 'tv', // /:id
    showInLinkList: false,
  },
  {
    description: 'Details',
    fullUrl: 'media', // /:id
    shortUrl: '', // /:id
    showInLinkList: false,
  },
  {
    description: 'User Start',
    fullUrl: 'user',
    shortUrl: 'user',
    showInLinkList: false,
  },
  {
    description: 'Passwort zurücksetzen',
    fullUrl: 'reset-password',
    shortUrl: 'reset-password',
    showInLinkList: true,
  },
];

export const getVisibleRoutes = (): VisibleRoute[] => {
  return ROUTES_LIST.filter(
    (route: RoutesListItem) => route.showInLinkList
  ).map((route: RoutesListItem) => ({
    description: route.description,
    fullUrl: route.fullUrl,
    shortUrl: route.shortUrl,
  }));
};
