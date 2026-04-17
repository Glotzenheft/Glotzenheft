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
    [TracklistTagType.FRANCHISE]: 'Franchise',
    [TracklistTagType.STUDIO]: 'Studio',
    [TracklistTagType.COUNTRY]: 'Land',
    [TracklistTagType.GENRE]: 'Genre',
    [TracklistTagType.THEME]: 'Theme',
    [TracklistTagType.DEMOGRAPHIC]: 'Demographic',
    [TracklistTagType.SEASON]: 'Season',
    [TracklistTagType.YEAR]: 'Jahr',
    [TracklistTagType.DECADE]: 'Jahrzehnt',
    [TracklistTagType.PERSON]: 'Person',
    [TracklistTagType.FORMAT]: 'Format',
    [TracklistTagType.PRODUCTION_COMPANY]: 'Produktionsfirma',
    [TracklistTagType.SOURCE_MATERIAL]: 'Quellenmaterial',
    [TracklistTagType.MEDIA_PROVIDER]: 'Medienanbieter',
    [TracklistTagType.OTHER]: 'Sonstiges',
};

export const TRACKLIST_TAG_TYPE_OPTIONS = Object.entries(TRACKLIST_TAG_TYPE_LABELS).map(
    ([value, label]) => ({ label, value: value as TracklistTagType })
);
