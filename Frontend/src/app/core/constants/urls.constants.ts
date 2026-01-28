import {
    ROOT_PATHS,
    TMDB_SIDEBAR_PATHS,
    ACTIVITY_PATHS,
    LEGAL_PATHS,
    AUTHENTICATION_PATHS,
    BACKUP_PATHS,
} from "./paths.constants";

export const ROOT_URLS = {
    home: `/${ROOT_PATHS.home}`,
} as const;

export const LEGAL_URLS = {
    imprint: `/${LEGAL_PATHS.imprint}`,
    privacy: `/${LEGAL_PATHS.privacy}`,
    terms: `/${LEGAL_PATHS.terms}`,
    about: `/${LEGAL_PATHS.about}`,
} as const;

export const TMDB_SIDEBAR_URLS = {
    dashboard: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.dashboard}`,
    analytics: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.analytics}`,
    activities: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.activities}`,
    tracklists: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.tracklists}`,
    tagsAndGroups: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.tagsAndGroups}`,
    calendar: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.calendar}`,
    customMedia: `/${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.customMedia}`,
} as const;

export const ACTIVITY_URLS = {
    watched: `/${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.watched}`,
    completed: `/${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.completed}`,
    started: `/${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.started}`,
    startedOrCompleted: `/${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.startedOrCompleted}`,
} as const;

export const SIDEBAR_OPTION_URLS = {
    resetPassword: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.resetPassword}`,
    deleteAccount: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.deleteAccount}`,
    dataBackup: `/${BACKUP_PATHS.base}`,
} as const;

export const SIDEBAR_GUEST_OPTION_URLS = {
    logIn: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.logIn}`,
    register: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.register}`,
} as const;