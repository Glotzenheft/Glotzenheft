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
    description: 'season',
    fullUrl: 'media/season/:id',
    shortUrl: 'season/:id',
    showInLinkList: false,
  },
  {
    description: 'film',
    fullUrl: 'media/film/:id',
    shortUrl: 'film/:id',
    showInLinkList: false,
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
