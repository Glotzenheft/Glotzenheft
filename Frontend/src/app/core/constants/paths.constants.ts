export const ROOT_PATHS = {
    home: '',
} as const;

export const LEGAL_PATHS = {
    imprint: 'imprint',
    privacy: 'privacy',
    terms: 'terms',
    about: 'about'
} as const;

export const TMDB_SIDEBAR_PATHS = {
    base: 'tmdb',
    dashboard: 'dashboard',
    analytics: 'analytics',
    activities: 'activities',
    tracklists: 'tracklists',
    tagsAndGroups: 'tags-and-groups',
    calendar: 'calendar',
    customMedia: 'custom-media',
} as const;

export const ACTIVITY_PATHS = {
    base: 'activities',
    watched: 'watched',
    completed: 'completed',
    started: 'started',
    startedOrCompleted: 'started-or-completed',
} as const;

export const AUTHENTICATION_PATHS = {
    base: 'auth',
    logIn: 'login',
    register: 'register',
    resetPassword: 'reset-password',
    deleteAccount: 'delete-account',
} as const;

export const MEDIA_PATHS = {
    base: 'media',
    movie: 'movie',
    tv: 'tv',
} as const;

export const BACKUP_PATHS = {
    base: 'backup',
} as const;