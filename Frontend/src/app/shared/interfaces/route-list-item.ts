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

export interface RoutesListItem {
    description: string;
    fullUrl: string;
    shortUrl: string;
    showInLinkList: boolean; // deciding whether url should be listet in a list of links of this webste, e. g. in the footer list
    showInSidebar: boolean;
}

export interface VisibleRoute {
    description: string;
    fullUrl: string;
    shortUrl: string;
}
