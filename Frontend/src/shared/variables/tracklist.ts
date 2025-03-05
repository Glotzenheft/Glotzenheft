export type TracklistStatusType =
  | 'watching'
  | 'pausing'
  | 'dropped'
  | 'rewatching'
  | 'plan to watch'
  | 'completed';

export const TRACK_LIST_STATUS_LIST: string[] = [
  'watching',
  'completed',
  'rewatching',
  'plan to watch',
  'dropped',
  'pausing',
];

export const convertTracklistStatusIntoGerman = (status: string): string => {
  switch (status) {
    case 'watching':
      return 'Am glotzen';
    case 'completed':
      return 'Abgeschlossen';
    case 'dropped':
      return 'Abgebrochen';
    case 'pausing':
      return 'Pausiert';
    case 'plan to watch':
      return 'Geplant';
    case 'rewatching':
      return 'Erneut glotzen';
  }

  return '';
};
