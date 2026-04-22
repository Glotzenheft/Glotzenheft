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

import {TracklistTagType} from '../tracklist-tag-type.enum';

export const TRACKLIST_TAG_TYPE_LABELS: Record<TracklistTagType, string> = {
    [TracklistTagType.GENRE]: 'Genre',
    [TracklistTagType.THEME]: 'Theme',
    [TracklistTagType.DEMOGRAPHIC]: 'Demographic',
    [TracklistTagType.FRANCHISE]: 'Franchise',
    [TracklistTagType.STUDIO]: 'Studio',
    [TracklistTagType.PERSON]: 'Person',
    [TracklistTagType.PRODUCTION_COMPANY]: 'Produktionsfirma',
    [TracklistTagType.MEDIA_PROVIDER]: 'Medienanbieter',
    [TracklistTagType.COUNTRY]: 'Land',
    [TracklistTagType.SEASON]: 'Season',
    [TracklistTagType.YEAR]: 'Jahr',
    [TracklistTagType.DECADE]: 'Jahrzehnt',
    [TracklistTagType.FORMAT]: 'Format',
    [TracklistTagType.SOURCE_MATERIAL]: 'Quellenmaterial',
    [TracklistTagType.OTHER]: 'Sonstiges',
};

export const TRACKLIST_TAG_TYPE_OPTIONS = Object.entries(TRACKLIST_TAG_TYPE_LABELS).map(
    ([value, label]) => ({ label, value: value as TracklistTagType })
);
