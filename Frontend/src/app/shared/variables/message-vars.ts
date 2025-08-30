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
    MessageObject,
    MessageStatusType,
} from '../interfaces/message-interfaces';

export const ERR_OBJECT_INVALID_AUTHENTICATION: MessageObject = {
    life: 7000,
    severity: 'error',
    summary: 'Ungültige Authentifizierung',
    detail: 'Ihre Sitzung ist abgelaufen. Sie werden abgemeldet.',
};

export const getMessageObject = (
    severity: MessageStatusType,
    summary: string = '',
    detail: string = '',
): MessageObject => {
    return {
        life: 7000,
        severity,
        summary,
        detail,
    };
};

export const REQUEST_THROTTLE_TIME: number = 10000; // in ms
