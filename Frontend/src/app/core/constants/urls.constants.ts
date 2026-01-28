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

import {
    ROOT_PATHS,
    TMDB_SIDEBAR_PATHS,
    ACTIVITY_PATHS,
    LEGAL_PATHS,
    AUTHENTICATION_PATHS,
    BACKUP_PATHS,
} from "./paths.constants";

export const ROOT_URLS = {
    home: `${ROOT_PATHS.home}`,
} as const;

export const LEGAL_URLS = {
    imprint: `${LEGAL_PATHS.imprint}`,
    privacy: `${LEGAL_PATHS.privacy}`,
    terms: `${LEGAL_PATHS.terms}`,
    about: `${LEGAL_PATHS.about}`,
} as const;

export const TMDB_SIDEBAR_URLS = {
    dashboard: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.dashboard}`,
    analytics: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.analytics}`,
    activities: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.activities}`,
    tracklists: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.tracklists}`,
    tagsAndGroups: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.tagsAndGroups}`,
    calendar: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.calendar}`,
    customMedia: `${TMDB_SIDEBAR_PATHS.base}/${TMDB_SIDEBAR_PATHS.customMedia}`,
} as const;

export const ACTIVITY_URLS = {
    watched: `${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.watched}`,
    completed: `${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.completed}`,
    started: `${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.started}`,
    startedOrCompleted: `${ACTIVITY_PATHS.base}/${ACTIVITY_PATHS.startedOrCompleted}`,
} as const;

export const AUTHENTICATION_URLS = {
    logIn: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.logIn}`,
    register: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.register}`,
    resetPassword: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.resetPassword}`,
    deleteAccount: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.deleteAccount}`,
}

export const SIDEBAR_OPTION_URLS = {
    resetPassword: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.resetPassword}`,
    deleteAccount: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.deleteAccount}`,
    dataBackup: `${BACKUP_PATHS.base}`,
} as const;

export const SIDEBAR_GUEST_OPTION_URLS = {
    logIn: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.logIn}`,
    register: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.register}`,
} as const;