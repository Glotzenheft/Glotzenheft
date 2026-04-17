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
