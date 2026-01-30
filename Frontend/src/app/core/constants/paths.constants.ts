/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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