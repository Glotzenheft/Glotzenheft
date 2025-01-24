import { RoutesListItem, VisibleRoute } from '../interfaces/route-list-item';

export const ROUTES_LIST: RoutesListItem[] = [
  {
    description: 'Impressum',
    fullUrl: 'impressum',
    shortUrl: 'impressum',
    showInLinkList: true,
  },
  {
    description: 'Über uns',
    fullUrl: 'about',
    shortUrl: 'about',
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
