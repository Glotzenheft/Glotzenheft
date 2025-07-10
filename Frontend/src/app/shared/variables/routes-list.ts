import { Route, Routes } from '@angular/router';
import { RoutesListItem, VisibleRoute } from '../interfaces/route-list-item';

export const ROUTES_LIST: RoutesListItem[] = [
    {
        // 0
        description: 'Impressum',
        fullUrl: 'imprint',
        shortUrl: 'imprint',
        showInLinkList: true,
    },
    {
        // 1
        description: 'Über uns',
        fullUrl: 'about',
        shortUrl: 'about',
        showInLinkList: true,
    },
    {
        // 2
        description: 'Datenschutzerklärung',
        fullUrl: 'privacy-policy',
        shortUrl: 'privacy-policy',
        showInLinkList: true,
    },
    {
        // 3
        description: 'Details',
        fullUrl: 'media/BLOCKED',
        shortUrl: 'season/:id',
        showInLinkList: false,
    },
    {
        // 4
        description: 'Multisuche',
        fullUrl: 'media/multi-search',
        shortUrl: 'multi-search',
        showInLinkList: false,
    },
    {
        // 5
        description: 'Filmübersicht',
        fullUrl: 'media/movie', // /:id
        shortUrl: 'movie', // /:id,
        showInLinkList: false,
    },
    {
        // 6
        description: 'Serienübersicht',
        fullUrl: 'media/tv', // /:id,
        shortUrl: 'tv', // /:id
        showInLinkList: false,
    },
    {
        // 7
        description: 'Details',
        fullUrl: 'media', // /:id
        shortUrl: '', // /:id
        showInLinkList: false,
    },
    {
        // 8
        description: 'Meine Übersicht',
        fullUrl: 'user',
        shortUrl: 'user',
        showInLinkList: false,
    },
    {
        // 9
        description: 'Passwort zurücksetzen',
        fullUrl: 'reset-password',
        shortUrl: 'reset-password',
        showInLinkList: false,
    },
    {
        // 10
        description: 'Login',
        fullUrl: 'login',
        shortUrl: 'login',
        showInLinkList: false,
    },
    {
        // 11
        description: 'Registrieren',
        fullUrl: 'register',
        shortUrl: 'register',
        showInLinkList: false,
    },
    {
        // 12
        description: 'Alle Tracklisten',
        fullUrl: 'user/tracklists',
        shortUrl: 'tracklists',
        showInLinkList: false,
    },
    {
        // 13
        description: 'Account löschen',
        fullUrl: 'user/delete-user',
        shortUrl: 'delete-user',
        showInLinkList: false,
    },
    {
        // 14
        description: 'Aktivitäten',
        fullUrl: 'user/activities',
        shortUrl: 'activities',
        showInLinkList: false,
    },
    {
        // 15
        description: 'Nutzungsbedingungen',
        fullUrl: 'terms-of-use',
        shortUrl: 'terms-of-use',
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

export const getVisibleRoutesForUser = (): VisibleRoute[] => {
    return ROUTES_LIST.filter((route: RoutesListItem) => {
        return (
            route.fullUrl.startsWith('user') && !route.fullUrl.includes('delete')
        );
    }).map((route: RoutesListItem) => ({
        description: route.description,
        fullUrl: route.fullUrl,
        shortUrl: route.shortUrl,
    }));
};
