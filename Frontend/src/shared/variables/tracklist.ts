export type TracklistStatusType =
  | 'watching'
  | 'pausing'
  | 'dropped'
  | 'rewatching'
  | 'plan to watch'
  | 'completed';

export const TRACK_LIST_STATUS_LIST: string[] = [
  'watching',
  'pausing',
  'dropped',
  'rewatching',
  'plan to watch',
  'completed',
];

export const convertTracklistStatusIntoGerman = (status: string): string => {
  switch (status) {
    case 'watching':
      return 'schauend';
    case 'completed':
      return 'abgeschlossen';
    case 'dropped':
      return 'abgebrochen';
    case 'pausing':
      return 'pausiert';
    case 'plan to watch':
      return 'Schauen geplant';
    case 'rewatching':
      return 'wiederanschauend';
  }

  return '';
};
