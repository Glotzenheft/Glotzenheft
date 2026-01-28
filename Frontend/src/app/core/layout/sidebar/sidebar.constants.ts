import {
    TMDB_SIDEBAR_URLS,
    LEGAL_URLS,
    SIDEBAR_OPTION_URLS,
    SIDEBAR_GUEST_OPTION_URLS,
} from "../../constants/urls.constants";
import { SidebarMenuItem } from "../../models/sidebar.models";
import { APP_ACTIONS } from "../../constants/actions.constants";

export const SIDEBAR_MAIN_MENU: SidebarMenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'pi pi-chart-line',
        routerLink: TMDB_SIDEBAR_URLS.dashboard,
    },
    {
        label: 'Analyse',
        icon: 'pi pi-chart-pie',
        routerLink: TMDB_SIDEBAR_URLS.analytics,
    },
    {
        label: 'Aktivitäten',
        icon: 'pi pi-arrow-right-arrow-left',
        routerLink: TMDB_SIDEBAR_URLS.activities,
    },
    {
        label: 'Tracklisten',
        icon: 'pi pi-list',
        routerLink: TMDB_SIDEBAR_URLS.tracklists,
    },
    {
        label: 'Tags & Gruppen',
        icon: 'pi pi-book',
        routerLink: TMDB_SIDEBAR_URLS.tagsAndGroups,
    },
    {
        label: 'Glotzkalender',
        icon: 'pi pi-calendar',
        routerLink: TMDB_SIDEBAR_URLS.calendar,
    },
    {
        label: 'Eigene Medien',
        icon: 'pi pi-database',
        routerLink: TMDB_SIDEBAR_URLS.customMedia,
    },
];

export const SIDEBAR_LEGAL_MENU: SidebarMenuItem[] = [
    {
        label: 'Impressum',
        icon: 'pi pi-book',
        routerLink: LEGAL_URLS.imprint,
    },
    {
        label: 'Über uns',
        icon: 'pi pi-compass',
        routerLink: LEGAL_URLS.about,
    },
    {
        label: 'Datenschutzerklärung',
        icon: 'pi pi-shield',
        routerLink: LEGAL_URLS.privacy,
    },
    {
        label: 'Nutzungsbedingung',
        icon: 'pi pi-flag',
        routerLink: LEGAL_URLS.terms,
    },
];

export const SIDEBAR_OPTION_MENU: SidebarMenuItem[] = [
    {
        label: 'Passwort ändern',
        icon: 'pi pi-user-edit',
        routerLink: SIDEBAR_OPTION_URLS.resetPassword,
    },
    {
        label: 'Account löschen',
        icon: 'pi pi-trash',
        routerLink: SIDEBAR_OPTION_URLS.deleteAccount,
    },
    {
        label: 'Datenbackup',
        icon: 'pi pi-database',
        routerLink: SIDEBAR_OPTION_URLS.dataBackup,
    },
    {
        label: 'Ausloggen',
        icon: 'pi pi-sign-out',
        action: APP_ACTIONS.logout,
    },
];

export const SIDEBAR_GUEST_MENU: SidebarMenuItem[] = [
    {
        label: 'Einloggen',
        icon: 'pi pi-sign-in',
        routerLink: SIDEBAR_GUEST_OPTION_URLS.logIn,
    },
    {
        label: 'Registrieren',
        icon: 'pi pi-user-plus',
        routerLink: SIDEBAR_GUEST_OPTION_URLS.register,
    },
];