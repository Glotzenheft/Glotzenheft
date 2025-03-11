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

export const TRACK_LIST_STATUS_LIST_AS_OBJECT: {
  german: string;
  value: string;
}[] = [
  {
    german: 'Am glotzen',
    value: 'watching',
  },
  {
    german: 'Abgeschlossen',
    value: 'completed',
  },
  {
    german: 'Abgebrochen',
    value: 'dropped',
  },
  {
    german: 'Pausiert',
    value: 'pausing',
  },
  {
    german: 'Geplant',
    value: 'plan to watch',
  },
  {
    german: 'Erneut glotzen',
    value: 'rewatching',
  },
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
