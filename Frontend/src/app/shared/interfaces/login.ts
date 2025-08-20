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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    security_question: string;
    security_answer: string;
    terms_accepted: boolean;
}

export interface LoginAndMessageResponse {
    message: string;
    token: string;
}

export interface ResetPasswordCredentials {
    security_question: string;
    security_answer: string;
    new_password: string;
}
