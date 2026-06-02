import { TracklistStatusEnum} from '../enums/tracklist-status.enum';

export const TRACKLIST_STATUS_LABELS_DE: Record<TracklistStatusEnum, string> = {
    [TracklistStatusEnum.WATCHING]: 'Am glotzen',
    [TracklistStatusEnum.PAUSING]: 'Pausiert',
    [TracklistStatusEnum.DROPPED]: 'Abgebrochen',
    [TracklistStatusEnum.PLAN_TO_WATCH]: 'Geplant',
    [TracklistStatusEnum.COMPLETED]: 'Abgeschlossen',
    [TracklistStatusEnum.SKIPPING]: 'Übersprungen'
};
